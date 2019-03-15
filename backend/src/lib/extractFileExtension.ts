export default function extractFileExtension(fileName: string): string {
    return fileName.split(".").pop();
}