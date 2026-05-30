import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { put } from "@vercel/blob";
import formidable from "formidable";
import { withRateLimit } from "../../lib/rate-limit";

// 禁用默认的 body parser，因为我们要处理文件上传
export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 验证登录
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ error: "未登录" });
  }

  try {
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filter: (part) => {
        // 只接受图片文件
        return part.mimetype?.startsWith("image/") || false;
      },
    });

    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: "没有上传文件" });
    }

    // 读取文件内容
    const fs = await import("fs/promises");
    const fileBuffer = await fs.readFile(file.filepath);

    // 生成唯一的文件名
    const originalName = file.originalFilename || "unknown";
    const ext = originalName.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const filename = `pet_${timestamp}_${random}.${ext}`;

    // 上传到 Vercel Blob
    const blob = await put(filename, fileBuffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // 返回 Blob URL
    return res.status(200).json({
      success: true,
      url: blob.url,
      filename: filename,
    });
  } catch (err: any) {
    console.error("上传文件失败:", err);
    return res.status(500).json({ error: "上传文件失败" });
  }
}

export default withRateLimit(handler, 'cart');
