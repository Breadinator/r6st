# r6st
Node web server I made to track my Rainbow Six Siege stats.

# Dependencies
In order to install and run an r6st server, one requires [Node.js](https://nodejs.org/) (written in [8.2.1](https://nodejs.org/dist/v8.2.1/)) and [node package manager](https://www.npmjs.com/) (npm; included with Node.js).

# Installation
In a terminal, run the following:

1. `git clone https://github.com/Breadinator/r6st && cd r6st`
2. `npm install sqlite3`

# Usage
* To run the r6st server, open a terminal in the directory in which the server files are located and run `node index`
* To connect to an r6st server, either: (1) connect to `localhost:12657` if it's hosted on the machine you're connecting to or (2) replace localhost with the [internal IP address](https://lifehacker.com/how-to-find-your-local-and-external-ip-address-5833108) of the server machine.
