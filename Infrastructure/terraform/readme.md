# Terraform
## How to Setup my local environment
### Dependencies
- anyenv
- tfenv
- terraform
- aws-cli

### Introduction

```sh
# install tfenv via anyenv
$ anyenv install tfenv

$ exec $SHEEL -l

$ tfenv -v
tfenv 2.0.0-beta2-1-g45a8ad7

$ cd ~/.anayenv/envs/tfenv
$ git checkout -b v1.0.2 v1.0.2
$ tfenv -v
tfenv 1.0.2

# install terraform via tfenv
$ tfenv install 0.12.5

$ terraform -v
Terraform v0.12.5

# install aws-cli via pip3
$ pip3 -V
pip 19.3.1 from /usr/local/lib/python3.7/site-packages/pip (python 3.7)
$ pip3 install awscli --upgrade

$ aws --version
aws-cli/1.18.37 Python/3.7.6 Darwin/19.3.0 botocore/1.15.37
```

## Provider I used

| No | Name |
| :---: | :---: |
| 1 | [AWS](https://www.terraform.io/docs/providers/aws/index.html) |


## Resource I created

| No | Name |
| :---: | :---: |
| 1 | [Amazon EC2 ( Amazon Elastic Compute Cloud )](https://aws.amazon.com/jp/ec2/) |
|  |  |
