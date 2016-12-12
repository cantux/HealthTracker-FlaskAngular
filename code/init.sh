
#!/bin/sh

apt-get update
apt-get upgrade
apt-get install git
wget https://repo.continuum.io/miniconda/Miniconda2-latest-Linux-x86_64.sh
bash Miniconda2-latest-Linux-x86_64.sh
apt-get install mysql-server
sudo apt-get install libmysqlclient-dev


git clone https://github.com/cantux/Fall2016Swe573cant.git
