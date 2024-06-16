ssh -i amazon_key.pem ec2-user@34.229.66.208

#!/bin/bash
set -e

# Update package list
sudo yum update -y

# Install Amazon Corretto 11 (OpenJDK 11)
sudo yum install java-11-amazon-corretto -y
java --version
echo 'export JAVA_HOME=/usr/lib/jvm/java-11-amazon-corretto' | sudo tee -a /etc/profile
source /etc/profile

# Install Docker
sudo yum install docker -y
sudo systemctl start docker
sudo systemctl enable docker

# Install Jenkins
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
sudo yum install jenkins -y
sudo systemctl start jenkins
sudo systemctl enable jenkins

sudo usermod -aG docker jenkins
sudo usermod -aG docker ec2-user
sudo systemctl restart jenkins
sudo systemctl restart docker

# Run SonarQube as a Docker container
sudo docker run -d --name sonar -p 9000:9000 sonarqube:lts-community

# Install Git (required for Jenkins)
sudo yum install -y git

# Install Trivy
sudo rpm -ivh https://github.com/aquasecurity/trivy/releases/download/v0.33.0/trivy_0.33.0_Linux-64bit.rpm

# Print Jenkins initial admin password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword

# Download the latest version of Docker Compose:
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Set executable permissions on the binary:
sudo chmod +x /usr/local/bin/docker-compose

# Optionally, install command completion for the bash shell:
sudo curl -L https://raw.githubusercontent.com/docker/compose/$(docker-compose version --short)/contrib/completion/bash/docker-compose -o /etc/bash_completion.d/docker-compose

sudo yum install php

php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"

sudo yum install php-zip
sudo yum install unzip p7zip
