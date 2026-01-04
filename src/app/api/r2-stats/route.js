import { NextResponse } from "next/server";
import { getUsageStats, resetUsage } from "@/config/r2-config";

/**
 * GET /api/r2-stats
 * View current R2 usage statistics
 */
export async function GET(req) {
  try {
    const stats = getUsageStats();
    
    return NextResponse.json({
      success: true,
      usage: stats,
      limits: {
        storage: "80% of 10 GB = 8 GB max",
        classA: "80% of 1M = 800K uploads/month max",
        classB: "80% of 10M = 8M reads/month max (mostly cached)",
      },
      warnings: {
        storage: stats.storage.percentage >= 70 ? "⚠️ Approaching storage limit" : null,
        classA: stats.classA.percentage >= 70 ? "⚠️ Approaching upload limit" : null,
        classB: stats.classB.percentage >= 70 ? "⚠️ Approaching read limit" : null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/r2-stats
 * Reset usage counters (admin only - for testing)
 */
export async function POST(req) {
  try {
    const body = await req.json();
    
    if (body.action === "reset") {
      resetUsage();
      return NextResponse.json({
        success: true,
        message: "R2 usage counters reset",
        usage: getUsageStats(),
      });
    }
    
    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
