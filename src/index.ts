import { Logger } from "@kolabuk/logger";
import { SshRemotePort } from "@kolabuk/sshremoteport";
import dotenv from "dotenv";
import { env } from "process";

//

//

(async () => {
  const logger = new Logger({
    dirPath: "./data/logs",
    debugMode: true,
    useMilliseconds: true,
  });
  try {
    logger.success("INIT");
    dotenv.config();
    const ssh = new SshRemotePort({
      remoteHost: String(env.sshremotehost),
      username: String(env.username),
      password: String(env.password),
      localForwardPort: Number(env.port),
    });
    await ssh.run({
      cbOnOpen: () => logger.info("tunnel opened"),
      cbOnClose: (err) =>
        logger.warn(`tunnel closed, ${err.message}\n${err.stack}`),
      cbOnRequest: (info) =>
        logger.debug(`inc request:\n${JSON.stringify(info, null, "\t")}`),
    });
  } catch (e: any) {
    logger.error(e.message);
    logger.error(e.stack);
  } finally {
    logger.close();
  }
})();
