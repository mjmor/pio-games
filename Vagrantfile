Vagrant.configure(2) do |config|
  # Install hashicorp/precise32 as the base OS (this is Ubuntu)
  # There is a directory of vagrant boxes you can choose from here:
  # https://atlas.hashicorp.com/boxes/search

  config.vm.box = "bento/ubuntu-16.04"

  # Name your virtual machine for virtualbox
  config.vm.provider "virtualbox" do |v|
    v.name = "pio_games_devbox"
  end

  config.vm.define "pio_games_devbox" do |pio_games_devbox|

    pio_games_devbox.vm.hostname = "pio"
    pio_games_devbox.vm.network "private_network", ip: "192.168.205.10"

    # Run vagrant.sh the first time a VM is set up
    # If you halt the machine and come back to it, this won't run again but if you
    # destroy the VM and come back to it, this will run again

    pio_games_devbox.vm.provision :shell, path: "vagrant.sh"
  end
end
