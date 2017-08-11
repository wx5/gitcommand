# gitcommand

### GIT官方指南
[Git官方指南](https://git-scm.com/book/zh/v2)

### 查看本地环境配置(包括登录用户名和邮箱)
- `git config -l`
- `git config --list`

### 配置用户名和邮箱
- `git config --global user.name "恭**"`
- `git config --global user.email "php****@163.com"`

### 获取远程仓库
- `git clone git://github.com/gitaccount/gitproject.git`

### 初始化一个目录为git本地仓库 
- `git init`

### 创建远程仓库repository
- 用浏览器登录github.com去new一个。

### 创建本地的ssh密钥
- `ssh-keygen -t rsa -C "本地邮箱如"`
- 提示信息：创建密钥的目录和使用密钥的密码(提交的时候需要用到)

### 加入更改
- `git add .`
- `git add readme.txt`
- `git add src/`

### 本地提交
- `git commit -m "description such as first commit."`

### 在远程仓库中创建一个分支(分支名称随便取origin,github,test均可)
- `git remote add origin git@github.com:gitaccount/gitproject.git`

### 删除分支关联
- `git remote rm origin`

### 提交本地仓库到远程项目仓库
- `git push -u origin master`

### 强制提交
- `git push -f`
---
### 来不及消化
此时如果origin的master分支上有一些本地没有的提交,push会失败.
所以解决的办法是, 首先设定本地master的上游分支:
    git branch --set-upstream-to=origin/master
然后pull:
    git pull --rebase
最后再push:
    git push


