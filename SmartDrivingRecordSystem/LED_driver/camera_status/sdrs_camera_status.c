#include <linux/version.h>
#include <linux/module.h>  
#include <linux/kernel.h>  
#include <linux/fs.h>
#include <linux/init.h>  
#include <linux/major.h>  
#include <linux/device.h>  
#include <linux/poll.h>  
#include <linux/io.h>  
#include <linux/delay.h>  
#include <linux/uaccess.h> /* for put_user */
#include <linux/kthread.h>
#include <linux/sched.h>

#if LINUX_VERSION_CODE > KERNEL_VERSION(2,6,0)
#include <linux/cdev.h>
static struct cdev mycdev; // 字元設備結構
#endif

#define SUCCESS 0
#define DEVICE_NAME "sdrs_camera" // 設備名稱
int Major; // 主設備號

// IO 窗口結構
struct io_windows {
    unsigned long phys_base;
    unsigned long len;
};

uint32_t *PERIBase; // 周邊設備基地址
uint32_t *GPIOBase; // GPIO 基地址
uint32_t *RIOBase;  // RIO 基地址
uint32_t *PADBase;  // PAD 基地址
uint32_t *pad;      // PAD 指針

// GPIO 寄存器結構
typedef struct {
    uint32_t status;
    uint32_t ctrl; 
} GPIOregs;

// 定義 GPIO 寄存器
#define GPIO ((GPIOregs*)GPIOBase)

// RIO 寄存器結構
typedef struct {
    uint32_t Out;   // 輸出寄存器
    uint32_t OE;    // 輸出使能寄存器
    uint32_t In;    // 輸入寄存器
    uint32_t InSync; // 同步輸入寄存器
} rioregs;

// 定義 RIO 寄存器
#define rio ((rioregs *)RIOBase)
#define rioXOR ((rioregs *)(RIOBase + 0x1000 / 4))
#define rioSET ((rioregs *)(RIOBase + 0x2000 / 4))
#define rioCLR ((rioregs *)(RIOBase + 0x3000 / 4))

// 定義字元設備類
static struct class *charmodule_class; 
static uint32_t pin = 17;  // 默認 GPIO 引腳
module_param(pin, uint, S_IRUGO); // 允許在加載模組時指定 GPIO
MODULE_PARM_DESC(pin, "GPIO pin number for the LED");

uint32_t fn = 5;    // 設置功能
int led_on_off = 0; // LED 狀態
struct task_struct *blink_task = NULL; // 反覆閃爍任務

// 反覆閃爍 LED 的函數
static int led_blink(void *data) {
    while (!kthread_should_stop()) {
        // 亮起 LED
#ifdef __READL_WRITEL__
        writel(1 << pin, &rioSET->Out);
#else
        rioSET->Out = 1 << pin;
#endif
        msleep(500); // 亮半秒

        // 關閉 LED
#ifdef __READL_WRITEL__
        writel(1 << pin, &rioCLR->Out);
#else
        rioCLR->Out = 1 << pin;
#endif
        msleep(500); // 暗半秒
    }
    return 0;
}

// 打開設備時的處理函數
static int led_open(struct inode *inode, struct file *file) {
    printk("led_open() 設置 GPIO%d 為 RIO\n", pin);

    // 設置 GPIO 引腳為 RIO
#ifdef __READL_WRITEL__
    writel(fn, &GPIO[pin].ctrl);
    writel(0x10, &pad[pin]);
    writel(0x01 << pin, &rioSET->OE);
    if (led_on_off != 0)
        writel(0x01 << pin, &rioSET->Out);
#else
    GPIO[pin].ctrl = fn;
    pad[pin] = 0x10;
    rioSET->OE = 0x01 << pin;
    if (led_on_off != 0)
        rioSET->Out = 0x01 << pin;
#endif
    return SUCCESS;
}

// 關閉設備時的處理函數
static int led_release(struct inode *inode, struct file *file) {
    u32 val;

    printk("led_release() 禁用輸出\n");
#ifdef __READL_WRITEL__
    val = readl(&rioSET->OE);
    writel(val & (~(0x01 << pin)), &rioSET->OE);
#else
    rioSET->OE &= ~(0x01 << pin); // 禁用指定的 GPIO
#endif
    if (blink_task && led_on_off != 2) {
        kthread_stop(blink_task);
        blink_task = NULL;
    }
    return 0;
}

// 讀取設備時的處理函數
static ssize_t led_read(struct file *filp, char *buffer, size_t length, loff_t *offset) {
    int bytes_read = 0;
    char prbuf[80];

    sprintf(prbuf, "%d\0", led_on_off);
    if (copy_to_user(buffer, prbuf, strlen(prbuf)) != 0) {
        printk("copy_to_user() 失敗\n");
        return -EFAULT;
    }
    bytes_read++;
    return bytes_read;
}

// 寫入設備時的處理函數
static ssize_t led_write(struct file *filp, const char *buff, size_t len, loff_t *off) {
    int bytes_written = 0;
    char pwbuf[80];

    if (copy_from_user(pwbuf, buff, len) != 0) {
        printk("led_write(): len:%lu\n", len);
        return -EFAULT;
    }
    sscanf(pwbuf, "%d", &led_on_off);
    printk("pwbuf: %s, led_on_off: %d, len: %d", pwbuf, led_on_off, len);
    if (led_on_off == 2) {
        // 開始反覆閃爍 LED
        if (!blink_task) {
            blink_task = kthread_run(led_blink, NULL, "led_blink");
        }
    } else {
        // 停止閃爍
        if (blink_task) {
            kthread_stop(blink_task);
            blink_task = NULL;
        }

        if (led_on_off == 1) {
            // 亮起 LED
#ifdef __READL_WRITEL__
            writel(1 << pin, &rioSET->Out);
#else
            rioSET->Out = 1 << pin;
#endif
        } else {
            // 不亮
#ifdef __READL_WRITEL__
            writel(1 << pin, &rioCLR->Out);
#else
            rioCLR->Out = 1 << pin;
#endif
        }
    }
    bytes_written++;
    return bytes_written;
}

// 文件操作結構
static struct file_operations fops = {
    .read = led_read,
    .write = led_write,
    .open = led_open,
    .release = led_release,
};

// 模塊初始化函數
int __init init_module(void) {
#if LINUX_VERSION_CODE > KERNEL_VERSION(2,6,0)
    dev_t devno = 0;

    if (Major) {
        if (register_chrdev_region(MKDEV(Major, 0), 1, DEVICE_NAME) < 0) {
            printk("register_chrdev_region() 失敗\n");
            goto fail_register_chrdev;
        }
    } else {
        if (alloc_chrdev_region(&devno, 0, 1, DEVICE_NAME) < 0) {
            printk("alloc_chrdev_region() 失敗\n");
            goto fail_register_chrdev;
        }
        Major = MAJOR(devno);
    }
    cdev_init(&mycdev, &fops);
    mycdev.owner = THIS_MODULE;
    if (cdev_add(&mycdev, MKDEV(Major, 0), 1)) {
        printk("添加 cdev 時出錯\n");
        goto fail_cdev_add;
    }
#else
    Major = register_chrdev(0, DEVICE_NAME, &fops);
    if (Major < 0) {
        printk("註冊字元設備失敗，錯誤碼: %d\n", Major);
        return -1;
    }
#endif

    // 創建屬於我們的類
#if LINUX_VERSION_CODE < KERNEL_VERSION(6,4,0)
    charmodule_class = class_create(THIS_MODULE, "charmodule_class");
#else
    charmodule_class = class_create("charmodule_class"); 
#endif

    if (IS_ERR(charmodule_class)) {
        printk("錯誤：創建類失敗。\n");
        return -1;
    }

    // 在 sysfs 中註冊設備
#if LINUX_VERSION_CODE > KERNEL_VERSION(2,6,27)
    int i = 0;
    device_create(charmodule_class, NULL, MKDEV(Major, i), NULL, "sdrs_camera%d", i);
    i++;
#elif LINUX_VERSION_CODE > KERNEL_VERSION(2,6,9)
    device_create(charmodule_class, NULL, MKDEV(Major, 0), "sdrs_camera"); 
#else
    class_simple_device_add(charmodule_class, MKDEV(Major, 0), NULL, "sdrs_camera");
#endif
    printk(KERN_ALERT "'mknod /dev/sdrs_camera c %d 0'.\n", Major);

    // 使用 ioremap 將物理地址映射到虛擬地址
    PERIBase = ioremap(0x1f00000000, 64 * 1024 * 1024);
    if (PERIBase == NULL) {
        printk("ioremap() 失敗\n");
        goto failed_ioremap;
    }
    GPIOBase = PERIBase + 0xD0000 / 4;
    RIOBase = PERIBase + 0xe0000 / 4;
    PADBase = PERIBase + 0xf0000 / 4;
    pad = PADBase + 1;
    led_on_off = 0;

    printk("PERIBase:%x\n", PERIBase);    
    printk("GPIOBase:%x\n", GPIOBase);    
    printk("RIOBase:%x\n", RIOBase);    
    printk("PADBase:%x\n", PADBase);
    printk("pad:%x\n", pad);

    return 0;

failed_ioremap:
    device_destroy(charmodule_class, MKDEV(Major, 0)); 
    class_destroy(charmodule_class); 
fail_cdev_add:
fail_register_chrdev:
    return -1;
}

// 模塊清理函數
void __exit cleanup_module(void) {
    // 解除映射虛擬地址
    iounmap(PERIBase);
#if LINUX_VERSION_CODE > KERNEL_VERSION(2,6,9)
    // 刪除設備節點
    device_destroy(charmodule_class, MKDEV(Major, 0)); 
    // 刪除創建的類
    class_destroy(charmodule_class); 
#else
    class_simple_device_remove(MKDEV(Major, 0));
    class_simple_destroy(charmodule_class);
#endif
#if LINUX_VERSION_CODE > KERNEL_VERSION(2,6,0)
    cdev_del(&mycdev);
    unregister_chrdev_region(MKDEV(Major, 0), 1);
#else
    unregister_chrdev(Major, DEVICE_NAME);
#endif
    printk("unregister_chrdev\n");
}

MODULE_LICENSE("GPL"); // 模塊授權