# swarm

## Docker Swarm
```
$ docker-compose up -d

$ docker container ls
CONTAINER ID        IMAGE                    COMMAND                  CREATED             STATUS              PORTS                                                              NAMES
a9fb35a57602        docker:18.05.0-ce-dind   "dockerd-entrypoint.…"   20 seconds ago      Up 18 seconds       2375/tcp, 4789/udp, 7946/tcp, 7946/udp                             worker02
cc373fc83bdf        docker:18.05.0-ce-dind   "dockerd-entrypoint.…"   20 seconds ago      Up 18 seconds       2375/tcp, 4789/udp, 7946/tcp, 7946/udp                             worker03
c45d5965c7c3        docker:18.05.0-ce-dind   "dockerd-entrypoint.…"   20 seconds ago      Up 18 seconds       2375/tcp, 4789/udp, 7946/tcp, 7946/udp                             worker01
1fecf9e37350        docker:18.05.0-ce-dind   "dockerd-entrypoint.…"   21 seconds ago      Up 20 seconds       2375/tcp, 3375/tcp, 0.0.0.0:9009->9009/tcp, 0.0.0.0:8000->80/tcp   manager
f070a712b93e        registry:2.6             "/entrypoint.sh /etc…"   34 minutes ago      Up 12 minutes       0.0.0.0:5000->5000/tcp                                             registy
```

```
$ docker container exec -it manager docker swarm init

$ docker container exec -it worker01 docker swarm join --token < JOIN TOKEN >  manager:2377
$ ... worker02 ...
$ ... worker03 ...

$ docker container exec -it manager docker node ls
ID                            HOSTNAME            STATUS              AVAILABILITY        MANAGER STATUS      ENGINE VERSION
6aecgacodexb6g7cgrzdnlkgk *   1fecf9e37350        Ready               Active              Leader              18.05.0-ce
6klap5aohmogk86iwoh4mna6k     a9fb35a57602        Ready               Active                                  18.05.0-ce
mpwz7rvxo93zdf0890osguwua     c45d5965c7c3        Ready               Active                                  18.05.0-ce
p112k75mdn5tbn2eeu85dzodm     cc373fc83bdf        Ready               Active                                  18.05.0-ce
```

## Docker Push/Pull

```
$ docker image tag example/echo:latest localhost:5000/example/echo:latest
# docker image push [push 先のレジストリのホスト/]リポジトリ名[:タグ]
$ docker image push localhost:5000/example/echo:latest

# docker image pull [pull 先のレジストリのホスト/]リポジトリ名[:タグ]
$ docker container exec -it worker01 docker image pull registry:5000/example/echo:latest
```

## Service

```
$ docker container exec -it manager docker service create --replicas 1 --publish 8000:8080 --name echo registry:5000/example/echo:latest

$ docker container exec -it manager docker service ls
ID                  NAME                MODE                REPLICAS            IMAGE                               PORTS
d8t87cy2gr9q        echo                replicated          0/1                 registry:5000/example/echo:latest   *:8000->8080/tcp

$ docker container exec -it manager docker service rm echo
echo
```

## Stack

```
$ docker container exec -it manager docker network create --driver=overlay --attachable ch03
networks Additional property networks is not allowed
```
