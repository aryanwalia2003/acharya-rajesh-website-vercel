import { NextResponse } from "next/server";
import { ApiError } from "./api-error";

type RequestHandler = (req: Request, ...args: any[]) => Promise<NextResponse>;

export const asyncHandler = (handler: RequestHandler) => {
  return async (req: Request, ...args: any[]) => {
    try {
      return await handler(req, ...args);
    } catch (err: any) {
      if (err instanceof ApiError) {
        return NextResponse.json(
          {
            success: false,
            message: err.message,
            errors: err.errors,
          },
          { status: err.statusCode }
        );
      }
      
      console.error("[API_ERROR]", err);
      
      // Default Error
      return NextResponse.json(
        {
          success: false,
          message: "Internal Server Error",
        },
        { status: 500 }
      );
    }
  };
};
