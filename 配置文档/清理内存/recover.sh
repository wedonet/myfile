#bin/sh
########
# 释放内存
#sync先保存再释放缓存，放数据丢失
sync
sync
echo 1 > /proc/sys/vm/drop_caches
# To free dentries and inodes:
echo 2 > /proc/sys/vm/drop_caches
# To free pagecache, dentries andinodes:
echo 3 > /proc/sys/vm/drop_caches
