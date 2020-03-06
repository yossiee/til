#/bin/sh
username=*****
password=******
oauthtoken=***
 ORGANIZATION=ダウンロードしたい組織名
mkdir $ORGANIZATION;
cd $ORGANIZATION;
for i in `curl -u $username:$oauthtoken -s https://api.github.com/orgs/$ORGANIZATION/repos?per_page=200 |grep html_url|awk 'NR%2 == 0'|cut -d ':'  -f 2-3|tr -d '",'`; do 
expect -c "
set timeout 20
spawn git clone $i.git
expect \"Username for \'https://github.com\':\"
send \"$username\n\"
expect \"Password for \'https://$username@github.com\':\"
send \"$password\n\"
interact
";
done
