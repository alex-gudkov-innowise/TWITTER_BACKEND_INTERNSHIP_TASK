import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
    constructor(private configService: ConfigService) {}

    public async createImageFile(file: Express.Multer.File) {
        // check the valid loaded file
        const fileExtension = path.extname(file.originalname).toLowerCase();

        if (!this.isFileImage(fileExtension)) {
            throw new BadRequestException({ message: 'invalid image type' });
        }

        // generate unique file name
        const fileName = uuid.v4() + fileExtension;
        const filePath = path.join(__dirname, '..', '..', 'static', 'images');
        const isPathExists = fs.existsSync(filePath);

        if (!isPathExists) {
            await fs.promises.mkdir(filePath, { recursive: true });
        }

        await fs.promises.writeFile(path.join(filePath, fileName), file.buffer);

        return {
            filePath,
            fileName,
        };
    }

    private isFileImage(fileExtension: string): boolean {
        const imageExtensions = this.configService.get<string>('IMAGE_EXTENSIONS').toLowerCase().split(' ');

        return imageExtensions.includes(fileExtension.toLowerCase());
    }
}
