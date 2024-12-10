import { Request, Response } from "express";
export type ControllerResponse = {
    code: number;
    body: any;
};
// Helper function to test controller methods. It returns a promise that
// resolves with the response of the controller method.
export function promiseTest(
    req: Request,
    method: (req: Request, res: Response) => void,
): Promise<ControllerResponse> {
    return new Promise((resolve) => {
        const res = {
            status: (code: number) => {
                return {
                    send: (body: any) => {
                        resolve({ code, body });
                    },
                } as Response;
            },
        } as Response;
        method(req, res);
    });
}
