const { execSync } = require("child_process");

/**
 * Commands used to obtain the public IP.
 * @type {string[]}
 */
const GET_PUBLIC_IP_COMMANDS = [
  "ipinfo.io/ip",
  `curl -s checkip.dyndns.org` +
    `| sed -e 's/.*Current IP Address: //' -e 's/<.*$//'`,
  "dig +short myip.opendns.com @resolver1.opendns.com"
];

/**
 * Class to obtain the current IP.
 */
class PublicIp {
  /**
   * Gets the public IP of the current machine by executing some
   * known commands in OSX.
   * @returns {string}
   */
  static get publicIP() {
    if (this.ip) {
      // Machine should change the IP while is running, so we're caching it.
      return this.ip;
    }
    for (const command of GET_PUBLIC_IP_COMMANDS) {
      try {
        this.ip = execSync(command)
          .toString()
          .trim();
      } catch (e) {}
    }
    return "";
  }

  /**
   * Obtains the public CIDRIP of the current machine.
   * @returns {string}
   */
  static get publicCIDRIP() {
    return PublicIp.publicIP + "/32";
  }
}

module.exports = PublicIp;
