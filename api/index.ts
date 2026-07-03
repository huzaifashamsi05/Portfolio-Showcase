import app from "../artifacts/api-server/dist/index.mjs";

export default function (req: any, res: any) {
  return app(req, res);
}
