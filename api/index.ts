export default async (req: any, res: any) => {
  try {
    const { default: app } = await import("../artifacts/api-server/src/app");
    return app(req, res);
  } catch (err: any) {
    console.error("Crash during module load:", err);
    res.status(500).json({ 
      error: "Vercel module crash", 
      details: err.message, 
      stack: err.stack 
    });
  }
};
