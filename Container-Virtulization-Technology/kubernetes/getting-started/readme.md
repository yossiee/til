# kubernetes

## Setup
### Enable Kubernetes on Docker Desktop for MacOS

### Install the kubectl
```
$ curl -LO https://storage.googleapis.com/kubernetes-release/v1.10.4/bin/darwin/amd64/kubectl \
  && chmod +x kubectl \
  && mv kubectl /usr/local/bin/
```

### Dashboard
Install dashboard

```
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v1.8.3/src/deploy/recommended/kubernetes-dashboard.yaml

$ kubectl get pod --namespace=kube-system -l k8s-app=kubernetes-dashboard
NAME                                    READY   STATUS    RESTARTS   AGE
kubernetes-dashboard-6fd7f9c494-6gphc   1/1     Running   0          42s

$ kubectl proxy
```

Sign in WebUI dashboard on browser

- [Kubernetes Dashboardにcluster-admin権限でSign inする](https://qiita.com/h-sakano/items/79bb15f7a0661e141c75)

```
$ kubectl -n kube-system get secret
$ kubectl -n kube-system describe secret deployment-controller-token-76t44
# copy the token and paste it on browser
```

## Kubernetes の概念

### Kubernetes クラスタと Node
- Kubernetes クラスタとはリソースの集合体
- 最も大きな概念が Node
    - クラスタには最低でも Master Node が存在
    - Node の一覧は下記のコマンドで確認

```
$ kubectl get nodes
NAME             STATUS   ROLES    AGE   VERSION
docker-desktop   Ready    master   25h   v1.14.8
```

## Namespace
- Namespace はクラスタの中に入れ子なる仮想的なクラスタを作成可能
- `default` , `docker` , `kube-public` , `kube-system` が予め用意
- 一覧を下記のコマンドで確認

```
$ kubectl get namespaces
NAME              STATUS   AGE
default           Active   25h
docker            Active   25h
kube-node-lease   Active   25h
kube-public       Active   25h
kube-system       Active   25h
```

## Pod
- Pod はコンテナの集合体(少なくとも 1 つは持っている)
- docker-compose な土で複数のコンテナを持つアプリは Pod で一括りにしてデプロイ
- Pod はいずれかの Node に配置される形になる

### Pod を作成する
`simple-pod.yaml` を作成して

```
$ kubectl apply -f simple-pod.yaml 
pod/simple-echo created
```
### Pod を操作する
```
# 一覧取得
$ kubectl get pod
NAME          READY   STATUS              RESTARTS   AGE
simple-echo   0/2     ContainerCreating   0          94s

# コンテナに入る
$ kubectl exec -it simple-echo sh -c nginx
/ # 

# 標準出力（ -c でコンテナを指定 ）
$ kubectl logs -f simple-echo -c echo
Error from server (BadRequest): container "echo" in pod 
 "simple-echo" is waiting to start: ContainerCreating

# pod の削除
$ kubectl delete pod simple-echo
pod "simple-echo" deleted

# もしくはマニフェストファイルを使用して
$ kubectl delete -f simple-pod.yaml
```
### ReplicaSet
- 同じ仕様の Pod を複数生成・管理するリソース
- YAML ファイルに Pod の内訳も含めて記載

`simple-replicaset.yaml` を作成して

```
# YAML を反映して作成
$ kubectl apply -f simple-replicaset.yaml 
replicaset.apps/simple-echo created

$ kubectl get pod
NAME                READY   STATUS              RESTARTS   AGE
simple-echo-j7c46   0/2     ContainerCreating   0          7s
simple-echo-xgzrf   0/2     ContainerCreating   0          7s
simple-echo-zv87x   0/2     ContainerCreating   0          7s

$ kubectl delete -f simple-replicaset.yaml 
replicaset.apps "simple-echo" deleted
```

## Deployment
- Replicaset より上位のリソース
- `Deployment >> Replicaset >> Pods` 的な関係
- Replicaset を管理・操作するリソース

`simple-deployment.yaml` を作成して

```
$ kubectl apply -f simple-deployment.yaml --record
deployment.apps/simple-echo created

$ kubectl get pod,replicaset,deployment --selector app=echo
NAME                               READY   STATUS    RESTARTS   AGE
pod/simple-echo-679f89b546-fftvp   2/2     Running   0          30s
pod/simple-echo-679f89b546-l2g8l   2/2     Running   0          30s
pod/simple-echo-679f89b546-xb5v6   2/2     Running   0          30s

NAME                                           DESIRED   CURRENT   READY   AGE
replicaset.extensions/simple-echo-679f89b546   3         3         3       30s

NAME                                READY   UP-TO-DATE   AVAILABLE   AGE
deployment.extensions/simple-echo   3/3     3            3           31s
```

### Replicaset のライフサイクル
- Deployment のリビジョンは `kubectl rollout history` で確認できる。
- Pod 数を変えても Replicaset は新しく生成されない
- コンテナのイメージを再定義したら Replicaset は新しく生成される

```
# Deployment のリビジョンを確認
$ kubectl rollout history deployment simple-echo
deployment.extensions/simple-echo 
REVISION  CHANGE-CAUSE
1         kubectl apply --filename=simple-deployment.yaml --record=true

# Pod 数を 3 から 4 に変更して
$ kubectl apply -f simple-deployment.yaml --record
deployment.apps/simple-echo configured

# 確認 -> 変わっていない
$ kubectl rollout history deployment simple-echo
deployment.extensions/simple-echo 
REVISION  CHANGE-CAUSE
1         kubectl apply --filename=simple-deployment.yaml --record=true

# 次はコンテナ定義を変える
# `simple-deployment.yaml` の `gihyodocker/echo:latest` -> `gihyodocker/echo:patched` に修正
$ kubectl apply -f simple-deployment.yaml --record
deployment.apps/simple-echo configured

# Pod を確認すると、停止している物も中にはある
$ kubectl get pod --selector app=echo
NAME                           READY   STATUS              RESTARTS   AGE
simple-echo-679f89b546-bw8zz   2/2     Terminating         0          11m
simple-echo-679f89b546-fftvp   2/2     Terminating         0          23m
simple-echo-679f89b546-l2g8l   2/2     Running             0          23m
simple-echo-679f89b546-xb5v6   2/2     Terminating         0          23m
simple-echo-6bd7755774-2nqwb   0/2     ContainerCreating   0          7s
simple-echo-6bd7755774-bfqxb   2/2     Running             0          22s
simple-echo-6bd7755774-l6lgr   2/2     Running             0          22s
simple-echo-6bd7755774-w4czt   0/2     ContainerCreating   0          4s

# 確認
$ kubectl rollout history deployment simple-echo
deployment.extensions/simple-echo 
REVISION  CHANGE-CAUSE
1         kubectl apply --filename=simple-deployment.yaml --record=true
2         kubectl apply --filename=simple-deployment.yaml --record=true
```

`REVISION=2` が作成されている。

### ロールバック
- リビジョンを元にロールバックが可能

```
# リビジョンを指定して確認
$ kubectl rollout history deployment simple-echo --revision=1
deployment.extensions/simple-echo with revision #1
Pod Template:
  Labels:	app=echo
	pod-template-hash=679f89b546
  Annotations:	kubernetes.io/change-cause: kubectl apply --filename=simple-deployment.yaml --record=true
  Containers:
   nginx:
    Image:	gihyodocker/nginx:latest
    Port:	80/TCP
    Host Port:	0/TCP
    Environment:
      BACKEND_HOST:	localhost:8080
    Mounts:	<none>
   echo:
    Image:	gihyodocker/echo:latest
    Port:	8080/TCP
    Host Port:	0/TCP
    Environment:	<none>
    Mounts:	<none>
  Volumes:	<none>

# ロールバックを実行
$ kubectl rollout undo deployment simple-echo
deployment.extensions/simple-echo rolled back

# Deployment の削除
$ kubectl delete -f simple-deployment.yaml 
deployment.apps "simple-echo" deleted
```

## Service
- マニフェストファイル `simple-replicaset-with-label.yaml` を作成
    - Replicaset が 2 定義されている。( spring + summer )

```
$ kubectl apply -f simple-replicaset-with-label.yaml 
replicaset.apps/echo-spring created
replicaset.apps/echo-summer created

# spring は Replicaset が 1 つ作成されたのが確認できる
$ kubectl get pod -l app=echo -l release=spring
NAME                READY   STATUS    RESTARTS   AGE
echo-spring-m8wp6   2/2     Running   0          25s

# summer は Replicaset が 2 つ作成されたのが確認できる
$ kubectl get pod -l app=echo -l release=summer
NAME                READY   STATUS    RESTARTS   AGE
echo-summer-jvncj   2/2     Running   0          32s
echo-summer-mncf2   2/2     Running   0          32s
```

`simple-service.yaml` を作成して release=summer を持つ Pod にだけアクセスできる Serive を作る。

- ClusterIP Service
Service には様々な種類があり、デフォルトが ClusterIP Service 。クラスタ上の内部 IP アドレスに Service を公開。Pod から 別の Pod へのアクセスを Service を通して行う。

```
$ kubectl apply -f simple-service.yaml 
service/echo created

# ClusterIP Service
$ kubectl get svc echo
NAME   TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
echo   ClusterIP   10.106.245.182   <none>        80/TCP    2m13s
```

- NodePort Service
各ノード上から Service ポートへ接続するためのグローバルなポートを開放。
`simple-service.yaml` の `spec` 下に `type: NodePort` を追記して apply

```
$ kubectl get svc echo
NAME   TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
echo   NodePort   10.106.244.188   <none>        80:31741/TCP   51m

# ローカルからアクセスできる
$ curl http://127.0.0.1:31741
Hello Docker!!
```

## Ingress
- Ingress は、クラスタ外に Service を公開することや VirtualHost やパスベースでの高度な HTTP ルーティングを解決。
- `simple-ingress.yaml` 新しく作成して反映させる。

```
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.16.2/deploy/mandatory.yaml
namespace/ingress-nginx created
deployment.extensions/default-http-backend created
service/default-http-backend created
configmap/nginx-configuration created
configmap/tcp-services created
configmap/udp-services created
serviceaccount/nginx-ingress-serviceaccount created
clusterrole.rbac.authorization.k8s.io/nginx-ingress-clusterrole created
role.rbac.authorization.k8s.io/nginx-ingress-role created
rolebinding.rbac.authorization.k8s.io/nginx-ingress-role-nisa-binding created
clusterrolebinding.rbac.authorization.k8s.io/nginx-ingress-clusterrole-nisa-binding created
deployment.extensions/nginx-ingress-controller created

$ kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.16.2/deploy/provider/cloud-generic.yaml
service/ingress-nginx created

$ ubectl -n ingress-nginx get service,pod
NAME                           TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)                      AGE
service/default-http-backend   ClusterIP      10.111.184.108   <none>        80/TCP                       2m12s
service/ingress-nginx          LoadBalancer   10.98.246.165    localhost     80:30033/TCP,443:32741/TCP   90s

NAME                                            READY   STATUS    RESTARTS   AGE
pod/default-http-backend-55b84578bf-mf8qm       1/1     Running   0          2m12s
pod/nginx-ingress-controller-5dbd85bb87-whpm2   1/1     Running   0          2m12s 
```


```
$ kubectl apply -f simple-ingress.yaml
ingress.extensions/echo created
```
