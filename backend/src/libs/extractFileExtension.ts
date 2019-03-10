/**
 * Returns file extension of any filename.
 * @param fileName Filename or path of target file.
 */
export default function extractFileExtension(fileName: string): string {
    return fileName.split(".").pop();
}