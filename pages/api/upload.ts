import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// 禁用默认的 body parser，因为我们要处理文件上传
export const config = {
  api: {
    bodyParser: false,
  },
};

// 确保上传目录存在
const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
      uploadDir,
      keepExtensions: true,
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

    // 生成唯一的文件名
    const ext = path.extname(file.originalFilename || "");
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const newFilename = `pet_${timestamp}_${random}${ext}`;
    const newPath = path.join(uploadDir, newFilename);

    // 重命名文件
    fs.renameSync(file.filepath, newPath);

    // 返回文件URL
    const fileUrl = `/uploads/${newFilename}`;

    return res.status(200).json({
      success: true,
      url: fileUrl,
      filename: newFilename,
    });
  } catch (err: any) {
    console.error("上传文件失败:", err);
    return res.status(500).json({ error: "上传文件失败" });
  }
}
