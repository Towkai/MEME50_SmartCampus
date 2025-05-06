#include <linux/module.h>
#define INCLUDE_VERMAGIC
#include <linux/build-salt.h>
#include <linux/elfnote-lto.h>
#include <linux/export-internal.h>
#include <linux/vermagic.h>
#include <linux/compiler.h>

#ifdef CONFIG_UNWINDER_ORC
#include <asm/orc_header.h>
ORC_HEADER;
#endif

BUILD_SALT;
BUILD_LTO_INFO;

MODULE_INFO(vermagic, VERMAGIC_STRING);
MODULE_INFO(name, KBUILD_MODNAME);

__visible struct module __this_module
__section(".gnu.linkonce.this_module") = {
	.name = KBUILD_MODNAME,
	.init = init_module,
#ifdef CONFIG_MODULE_UNLOAD
	.exit = cleanup_module,
#endif
	.arch = MODULE_ARCH_INIT,
};

#ifdef CONFIG_RETPOLINE
MODULE_INFO(retpoline, "Y");
#endif



static const struct modversion_info ____versions[]
__used __section("__versions") = {
	{ 0x122c3a7e, "_printk" },
	{ 0xf3e73477, "kthread_stop" },
	{ 0xf9a482f9, "msleep" },
	{ 0xb3f7646e, "kthread_should_stop" },
	{ 0xdcb764ad, "memset" },
	{ 0xbcab6ee6, "sscanf" },
	{ 0x12a4e128, "__arch_copy_from_user" },
	{ 0x3254ffd3, "kthread_create_on_node" },
	{ 0x9938fd1a, "wake_up_process" },
	{ 0x7682ba4e, "__copy_overflow" },
	{ 0xf0fdf6cb, "__stack_chk_fail" },
	{ 0x3c3ff9fd, "sprintf" },
	{ 0x98cf60b3, "strlen" },
	{ 0x6cbbfc54, "__arch_copy_to_user" },
	{ 0x3fd78f3b, "register_chrdev_region" },
	{ 0xe78e8907, "cdev_init" },
	{ 0x39f012c6, "cdev_add" },
	{ 0x3fa498ad, "class_create" },
	{ 0xfbe72bcf, "device_create" },
	{ 0xaf56600a, "arm64_use_ng_mappings" },
	{ 0x40863ba1, "ioremap_prot" },
	{ 0xe3ec2f2b, "alloc_chrdev_region" },
	{ 0xb86bb5ac, "device_destroy" },
	{ 0xa4e5832c, "class_destroy" },
	{ 0xedc03953, "iounmap" },
	{ 0xa4afd25e, "cdev_del" },
	{ 0x6091b333, "unregister_chrdev_region" },
	{ 0xef0e635e, "param_ops_uint" },
	{ 0x67a35d9, "module_layout" },
};

MODULE_INFO(depends, "");


MODULE_INFO(srcversion, "1C02BB50CFCB5EE923E473E");
