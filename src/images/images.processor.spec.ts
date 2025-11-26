import { Job, Queue, SandboxedJob } from 'bullmq';
import * as fs from 'node:fs/promises';
import imageProcessor from './images.processor';
import { ImageJobData } from './images.service';

describe('ImagesProcessor', () => {
  it('should resize image', async () => {
    const transformations = {
      resize: { width: 50, height: 50 },
      format: 'png',
    };

    const originalImageBufferObject = (await JSON.parse(
      await fs.readFile('test-resources/original-image-buffer-object.txt', {
        encoding: 'utf8',
      }),
    )) as { type: 'Buffer'; data: Array<any> };

    const manipulatedImageBuffer = Buffer.from(
      (
        (await JSON.parse(
          await fs.readFile(
            'test-resources/manipulated-image-buffer-resize.txt',
            {
              encoding: 'utf8',
            },
          ),
        )) as { type: 'Buffer'; data: Array<any> }
      ).data,
    );

    const job = new Job(new Queue('images'), '', {
      transformations,
      imageBuffer: originalImageBufferObject,
    }) as unknown as SandboxedJob<ImageJobData>;

    expect(await imageProcessor(job)).toEqual(manipulatedImageBuffer);
  });

  it('should crop image', async () => {
    const transformations = {
      crop: { width: 50, height: 50, x: 150, y: 150 },
      format: 'png',
    };

    const originalImageBufferObject = (await JSON.parse(
      await fs.readFile('test-resources/original-image-buffer-object.txt', {
        encoding: 'utf8',
      }),
    )) as { type: 'Buffer'; data: Array<any> };

    const manipulatedImageBuffer = Buffer.from(
      (
        (await JSON.parse(
          await fs.readFile(
            'test-resources/manipulated-image-buffer-crop.txt',
            {
              encoding: 'utf8',
            },
          ),
        )) as { type: 'Buffer'; data: Array<any> }
      ).data,
    );

    const job = new Job(new Queue('images'), '', {
      transformations,
      imageBuffer: originalImageBufferObject,
    }) as unknown as SandboxedJob<ImageJobData>;

    expect(await imageProcessor(job)).toEqual(manipulatedImageBuffer);
  });

  it('should flip image horizontally', async () => {
    const transformations = { flip: { horizontal: true }, format: 'png' };
    const originalImageBufferObject = (await JSON.parse(
      await fs.readFile('test-resources/original-image-buffer-object.txt', {
        encoding: 'utf8',
      }),
    )) as { type: 'Buffer'; data: Array<any> };

    const manipulatedImageBuffer = Buffer.from(
      (
        (await JSON.parse(
          await fs.readFile(
            'test-resources/manipulated-image-buffer-flip-horizontal.txt',
            {
              encoding: 'utf8',
            },
          ),
        )) as { type: 'Buffer'; data: Array<any> }
      ).data,
    );

    const job = new Job(new Queue('images'), '', {
      transformations,
      imageBuffer: originalImageBufferObject,
    }) as unknown as SandboxedJob<ImageJobData>;

    expect(await imageProcessor(job)).toEqual(manipulatedImageBuffer);
  });

  it('should flip image vertically', async () => {
    const transformations = { flip: { vertical: true }, format: 'png' };
    const originalImageBufferObject = (await JSON.parse(
      await fs.readFile('test-resources/original-image-buffer-object.txt', {
        encoding: 'utf8',
      }),
    )) as { type: 'Buffer'; data: Array<any> };

    const manipulatedImageBuffer = Buffer.from(
      (
        (await JSON.parse(
          await fs.readFile(
            'test-resources/manipulated-image-buffer-flip-vertical.txt',
            {
              encoding: 'utf8',
            },
          ),
        )) as { type: 'Buffer'; data: Array<any> }
      ).data,
    );

    const job = new Job(new Queue('images'), '', {
      transformations,
      imageBuffer: originalImageBufferObject,
    }) as unknown as SandboxedJob<ImageJobData>;

    expect(await imageProcessor(job)).toEqual(manipulatedImageBuffer);
  });

  it('should flip image horizontally and vertically', async () => {
    const transformations = {
      flip: { horizontal: true, vertical: true },
      format: 'png',
    };
    const originalImageBufferObject = (await JSON.parse(
      await fs.readFile('test-resources/original-image-buffer-object.txt', {
        encoding: 'utf8',
      }),
    )) as { type: 'Buffer'; data: Array<any> };

    const manipulatedImageBuffer = Buffer.from(
      (
        (await JSON.parse(
          await fs.readFile(
            'test-resources/manipulated-image-buffer-flip-horizontal-and-vertical.txt',
            {
              encoding: 'utf8',
            },
          ),
        )) as { type: 'Buffer'; data: Array<any> }
      ).data,
    );

    const job = new Job(new Queue('images'), '', {
      transformations,
      imageBuffer: originalImageBufferObject,
    }) as unknown as SandboxedJob<ImageJobData>;

    expect(await imageProcessor(job)).toEqual(manipulatedImageBuffer);
  });

  it('should rotate image 90 degrees', async () => {
    const transformations = { rotate: 90, format: 'png' };
    const originalImageBufferObject = (await JSON.parse(
      await fs.readFile('test-resources/original-image-buffer-object.txt', {
        encoding: 'utf8',
      }),
    )) as { type: 'Buffer'; data: Array<any> };

    const manipulatedImageBuffer = Buffer.from(
      (
        (await JSON.parse(
          await fs.readFile(
            'test-resources/manipulated-image-buffer-rotate.txt',
            {
              encoding: 'utf8',
            },
          ),
        )) as { type: 'Buffer'; data: Array<any> }
      ).data,
    );

    const job = new Job(new Queue('images'), '', {
      transformations,
      imageBuffer: originalImageBufferObject,
    }) as unknown as SandboxedJob<ImageJobData>;

    expect(await imageProcessor(job)).toEqual(manipulatedImageBuffer);
  });

  it('should apply invert filter', async () => {
    const transformations = {
      filters: {
        blur: 0,
        dither: false,
        fisheye: false,
        greyscale: false,
        invert: true,
        pixelate: 0,
        sepia: false,
      },
      format: 'png',
    };
    const originalImageBufferObject = (await JSON.parse(
      await fs.readFile('test-resources/original-image-buffer-object.txt', {
        encoding: 'utf8',
      }),
    )) as { type: 'Buffer'; data: Array<any> };

    const manipulatedImageBuffer = Buffer.from(
      (
        (await JSON.parse(
          await fs.readFile(
            'test-resources/manipulated-image-buffer-filter-invert.txt',
            {
              encoding: 'utf8',
            },
          ),
        )) as { type: 'Buffer'; data: Array<any> }
      ).data,
    );

    const job = new Job(new Queue('images'), '', {
      transformations,
      imageBuffer: originalImageBufferObject,
    }) as unknown as SandboxedJob<ImageJobData>;

    expect(await imageProcessor(job)).toEqual(manipulatedImageBuffer);
  });

  it('should apply blur filter', async () => {
    const transformations = {
      filters: {
        blur: 10,
        dither: false,
        fisheye: false,
        greyscale: false,
        invert: false,
        pixelate: 0,
        sepia: false,
      },
      format: 'png',
    };
    const originalImageBufferObject = (await JSON.parse(
      await fs.readFile('test-resources/original-image-buffer-object.txt', {
        encoding: 'utf8',
      }),
    )) as { type: 'Buffer'; data: Array<any> };

    const manipulatedImageBuffer = Buffer.from(
      (
        (await JSON.parse(
          await fs.readFile(
            'test-resources/manipulated-image-buffer-filter-blur.txt',
            {
              encoding: 'utf8',
            },
          ),
        )) as { type: 'Buffer'; data: Array<any> }
      ).data,
    );

    const job = new Job(new Queue('images'), '', {
      transformations,
      imageBuffer: originalImageBufferObject,
    }) as unknown as SandboxedJob<ImageJobData>;

    expect(await imageProcessor(job)).toEqual(manipulatedImageBuffer);
  });

  it('should apply dither filter', async () => {
    const transformations = {
      filters: {
        blur: 0,
        dither: true,
        fisheye: false,
        greyscale: false,
        invert: false,
        pixelate: 0,
        sepia: false,
      },
      format: 'png',
    };
    const originalImageBufferObject = (await JSON.parse(
      await fs.readFile('test-resources/original-image-buffer-object.txt', {
        encoding: 'utf8',
      }),
    )) as { type: 'Buffer'; data: Array<any> };

    const manipulatedImageBuffer = Buffer.from(
      (
        (await JSON.parse(
          await fs.readFile(
            'test-resources/manipulated-image-buffer-filter-dither.txt',
            {
              encoding: 'utf8',
            },
          ),
        )) as { type: 'Buffer'; data: Array<any> }
      ).data,
    );

    const job = new Job(new Queue('images'), '', {
      transformations,
      imageBuffer: originalImageBufferObject,
    }) as unknown as SandboxedJob<ImageJobData>;

    expect(await imageProcessor(job)).toEqual(manipulatedImageBuffer);
  });

  it('should apply fisheye filter', async () => {
    const transformations = {
      filters: {
        blur: 0,
        dither: false,
        fisheye: true,
        greyscale: false,
        invert: false,
        pixelate: 0,
        sepia: false,
      },
      format: 'png',
    };
    const originalImageBufferObject = (await JSON.parse(
      await fs.readFile('test-resources/original-image-buffer-object.txt', {
        encoding: 'utf8',
      }),
    )) as { type: 'Buffer'; data: Array<any> };

    const manipulatedImageBuffer = Buffer.from(
      (
        (await JSON.parse(
          await fs.readFile(
            'test-resources/manipulated-image-buffer-filter-fisheye.txt',
            {
              encoding: 'utf8',
            },
          ),
        )) as { type: 'Buffer'; data: Array<any> }
      ).data,
    );

    const job = new Job(new Queue('images'), '', {
      transformations,
      imageBuffer: originalImageBufferObject,
    }) as unknown as SandboxedJob<ImageJobData>;

    expect(await imageProcessor(job)).toEqual(manipulatedImageBuffer);
  });

  it('should apply greyscale filter', async () => {
    const transformations = {
      filters: {
        blur: 0,
        dither: false,
        fisheye: false,
        greyscale: true,
        invert: false,
        pixelate: 0,
        sepia: false,
      },
      format: 'png',
    };
    const originalImageBufferObject = (await JSON.parse(
      await fs.readFile('test-resources/original-image-buffer-object.txt', {
        encoding: 'utf8',
      }),
    )) as { type: 'Buffer'; data: Array<any> };

    const manipulatedImageBuffer = Buffer.from(
      (
        (await JSON.parse(
          await fs.readFile(
            'test-resources/manipulated-image-buffer-filter-greyscale.txt',
            {
              encoding: 'utf8',
            },
          ),
        )) as { type: 'Buffer'; data: Array<any> }
      ).data,
    );

    const job = new Job(new Queue('images'), '', {
      transformations,
      imageBuffer: originalImageBufferObject,
    }) as unknown as SandboxedJob<ImageJobData>;

    expect(await imageProcessor(job)).toEqual(manipulatedImageBuffer);
  });

  it('should apply sepia filter', async () => {
    const transformations = {
      filters: {
        blur: 0,
        dither: false,
        fisheye: false,
        greyscale: false,
        invert: false,
        pixelate: 0,
        sepia: true,
      },
      format: 'png',
    };
    const originalImageBufferObject = (await JSON.parse(
      await fs.readFile('test-resources/original-image-buffer-object.txt', {
        encoding: 'utf8',
      }),
    )) as { type: 'Buffer'; data: Array<any> };

    const manipulatedImageBuffer = Buffer.from(
      (
        (await JSON.parse(
          await fs.readFile(
            'test-resources/manipulated-image-buffer-filter-sepia.txt',
            {
              encoding: 'utf8',
            },
          ),
        )) as { type: 'Buffer'; data: Array<any> }
      ).data,
    );

    const job = new Job(new Queue('images'), '', {
      transformations,
      imageBuffer: originalImageBufferObject,
    }) as unknown as SandboxedJob<ImageJobData>;

    expect(await imageProcessor(job)).toEqual(manipulatedImageBuffer);
  });

  it('should apply pixelate filter', async () => {
    const transformations = {
      filters: {
        blur: 0,
        dither: false,
        fisheye: false,
        greyscale: false,
        invert: false,
        pixelate: 10,
        sepia: false,
      },
      format: 'png',
    };
    const originalImageBufferObject = (await JSON.parse(
      await fs.readFile('test-resources/original-image-buffer-object.txt', {
        encoding: 'utf8',
      }),
    )) as { type: 'Buffer'; data: Array<any> };

    const manipulatedImageBuffer = Buffer.from(
      (
        (await JSON.parse(
          await fs.readFile(
            'test-resources/manipulated-image-buffer-filter-pixelate.txt',
            {
              encoding: 'utf8',
            },
          ),
        )) as { type: 'Buffer'; data: Array<any> }
      ).data,
    );

    const job = new Job(new Queue('images'), '', {
      transformations,
      imageBuffer: originalImageBufferObject,
    }) as unknown as SandboxedJob<ImageJobData>;

    expect(await imageProcessor(job)).toEqual(manipulatedImageBuffer);
  });

  it('should format image to jpeg', async () => {
    const transformations = { format: 'jpeg' };
    const originalImageBufferObject = (await JSON.parse(
      await fs.readFile('test-resources/original-image-buffer-object.txt', {
        encoding: 'utf8',
      }),
    )) as { type: 'Buffer'; data: Array<any> };

    const manipulatedImageBuffer = Buffer.from(
      (
        (await JSON.parse(
          await fs.readFile(
            'test-resources/manipulated-image-buffer-format-jpeg.txt',
            {
              encoding: 'utf8',
            },
          ),
        )) as { type: 'Buffer'; data: Array<any> }
      ).data,
    );

    const job = new Job(new Queue('images'), '', {
      transformations,
      imageBuffer: originalImageBufferObject,
    }) as unknown as SandboxedJob<ImageJobData>;

    expect(await imageProcessor(job)).toEqual(manipulatedImageBuffer);
  });

  it('should format image to gif', async () => {
    const transformations = { format: 'gif' };
    const originalImageBufferObject = (await JSON.parse(
      await fs.readFile('test-resources/original-image-buffer-object.txt', {
        encoding: 'utf8',
      }),
    )) as { type: 'Buffer'; data: Array<any> };

    const manipulatedImageBuffer = Buffer.from(
      (
        (await JSON.parse(
          await fs.readFile(
            'test-resources/manipulated-image-buffer-format-gif.txt',
            {
              encoding: 'utf8',
            },
          ),
        )) as { type: 'Buffer'; data: Array<any> }
      ).data,
    );

    const job = new Job(new Queue('images'), '', {
      transformations,
      imageBuffer: originalImageBufferObject,
    }) as unknown as SandboxedJob<ImageJobData>;

    expect(await imageProcessor(job)).toEqual(manipulatedImageBuffer);
  });
});
