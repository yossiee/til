# Jenkins Container

## Usage

### Only master container

```yaml
version: "3"
services:
  master:
    container_name: master
    image: jenkins:latest
    ports:
      - 8080:8080
    volumes:
      - ./jenkins_home:/var/jenkins_home
    links:
      - slave01
```

```
$ docker-compose up
| Dec 24, 2019 12:59:59 AM jenkins.install.SetupWizard init

...

master    | *************************************************************
master    | *************************************************************
master    | *************************************************************
master    |
master    | Jenkins initial setup is required. An admin user has been created and a password generated.
master    | Please use the following password to proceed to installation:
master    |
master    | 11112222aaaabbbb33334444ccccdddd
master    |
master    | This may also be found at: /var/jenkins_home/secrets/initialAdminPassword
master    |
master    | *************************************************************
master    | *************************************************************
master    | *************************************************************
```

copy initial admin password.
And, initial setup on `http://localhost:8080`. Sign up

### Generate ssh key

```
$ docker-compose up -d

$ docker container exec -it master ssh-keygen -t rsa -C ""
Generating public/private rsa key pair.
Enter file in which to save the key (/var/jenkins_home/.ssh/id_rsa):
Created directory '/var/jenkins_home/.ssh'.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /var/jenkins_home/.ssh/id_rsa.
Your public key has been saved in /var/jenkins_home/.ssh/id_rsa.pub.
```

### Add slave container to Jenkins master container

Add the following to `docker-compose.yml`.

```yml
version: "3"

~~~

    slave01:
        container_name: slave01
        image: jenkinsci/ssh-slave
        environment:
            - JENKINS_SLAVE_SSH_PUBKEY=ssh-rsa
```

### Summary of connection between containers

- Create master container and generate SSH key in master container
- Add container for slave and add SSH public key to `docker-compose.yml` using environment valiable.
- Connect between master container and slave container using `links:` in servive section.

```
$ docker-compose up -d

$ docker-compose ps
Name                Command               State                 Ports
------------------------------------------------------------------------------------
master    /bin/tini -- /usr/local/bi ...   Up      50000/tcp, 0.0.0.0:8080->8080/tcp
slave01   setup-sshd                       Up      22/tcp
```
