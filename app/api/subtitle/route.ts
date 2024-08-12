import { execSync } from "child_process";
import { readFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const link = await req.json();
	const res = execSync(
		`youtube-dl --write-sub --sub-lang en --skip-download --sub-format vtt ${link}`
	);
	const arr = res.toString().split(":");
	const data = readFileSync(
		`${process.cwd()}/${arr[arr.length - 1].trim()}`,
		"utf8"
	);
	return NextResponse.json(data);
}
