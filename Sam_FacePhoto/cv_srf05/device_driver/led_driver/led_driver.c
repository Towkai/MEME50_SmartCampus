#include <linux/module.h>
#include <linux/fs.h>
#include <linux/uaccess.h>
#include <linux/gpio.h>
#include <linux/cdev.h>
#include <linux/device.h>

#define GPIO_LED 588  // 你接 LED 的 GPIO 腳位
#define DEVICE_NAME "mychardev"

static dev_t dev;
static struct cdev my_cdev;
static struct class *my_class;

static ssize_t my_write(struct file *file, const char __user *buf, size_t len, loff_t *off) {

    printk(KERN_INFO "my_write() called\n");

    char kbuf[10] = {0};

    if (copy_from_user(kbuf, buf, len > 9 ? 9 : len))
        return -EFAULT;

    if (strncmp(kbuf, "on", 2) == 0) {
        gpio_set_value(GPIO_LED, 1);
        printk(KERN_INFO "LED ON\n");
    } else if (strncmp(kbuf, "off", 3) == 0) {
        gpio_set_value(GPIO_LED, 0);
        printk(KERN_INFO "LED OFF\n");
    }

    return len;
}

static int my_open(struct inode *inode, struct file *file) {
    return 0;
}

static int my_release(struct inode *inode, struct file *file) {
    return 0;
}

static struct file_operations fops = {
    .owner = THIS_MODULE,
    .open = my_open,
    .write = my_write,
    .release = my_release,
};

static int __init my_init(void) {
    alloc_chrdev_region(&dev, 0, 1, DEVICE_NAME);
    cdev_init(&my_cdev, &fops);
    cdev_add(&my_cdev, dev, 1);

    my_class = class_create(DEVICE_NAME);

    device_create(my_class, NULL, dev, NULL, DEVICE_NAME);

    gpio_request(GPIO_LED, "LED");
    gpio_direction_output(GPIO_LED, 0);  // 預設熄滅

    printk(KERN_INFO "mychardev LED driver loaded\n");
    return 0;
}

static void __exit my_exit(void) {
    gpio_set_value(GPIO_LED, 0);
    gpio_free(GPIO_LED);

    device_destroy(my_class, dev);
    class_destroy(my_class);
    cdev_del(&my_cdev);
    unregister_chrdev_region(dev, 1);
    printk(KERN_INFO "mychardev LED driver unloaded\n");
}

module_init(my_init);
module_exit(my_exit);

MODULE_LICENSE("GPL");
