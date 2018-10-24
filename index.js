const { execSync } = require("child_process");
const { networkInterfaces } = require("os");

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
class IpInfo {
  constructor() {
    /**
     * The public IP of the machine.
     * Machine should change the IP while is running, so we're caching it.
     * @type {string}
     * @private
     */
    this._publicIp = "";
    /**
     * The local network IP.
     * @type {string}
     * @private
     */
    this._localIp = "";
  }
  /**
   * Gets the public IP of the current machine by executing some
   * known commands in OSX.
   * @returns {string}
   */
  static get publicIP() {
    if (this._publicIp) {
      return this._publicIp;
    }
    for (const command of GET_PUBLIC_IP_COMMANDS) {
      try {
        this._publicIp = execSync(command)
          .toString()
          .trim();
        return this._publicIp;
      } catch (e) {}
    }
    return this._publicIp;
  }

  /**
   * Obtains the public CIDRIP of the current machine.
   * @returns {string}
   */
  static get publicCIDRIP() {
    return IpInfo.publicIP + "/32";
  }

  /**
   * Obtains the local IP address inside the network.
   * @returns {*}
   */
  static get localIP() {
    if (this._localIp) {
      return this._localIp;
    }
    const interfaces = networkInterfaces();
    for (let k in interfaces) {
      for (let k2 in interfaces[k]) {
        let address = interfaces[k][k2];
        if (address.family === "IPv4" && !address.internal) {
          this._localIp = address.address;
          return this._localIp;
        }
      }
    }
    return "localhost";
  }
}

module.exports = IpInfo;
