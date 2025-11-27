import { Job, Queue, SandboxedJob } from 'bullmq';
import * as fs from 'node:fs/promises';
import imageProcessor from './images.processor';
import { ImageJobData } from './images.service';

describe('ImagesProcessor', () => {
  const imagesQueue = new Queue('images');
  let originalImageBufferObject: { type: 'Buffer'; data: Array<any> };

  async function getStoredBuffer(fileName: string): Promise<Buffer> {
    return Buffer.from(
      (
        (await JSON.parse(
          await fs.readFile(`test-resources/${fileName}`, {
            encoding: 'utf8',
          }),
        )) as { type: 'Buffer'; data: Array<any> }
      ).data,
    );
  }

  function createJob(
    transformations: Record<any, any>,
  ): SandboxedJob<ImageJobData> {
    return new Job(imagesQueue, '', {
      transformations,
      imageBuffer: originalImageBufferObject,
    }) as unknown as SandboxedJob<ImageJobData>;
  }

  beforeAll(async () => {
    originalImageBufferObject = (await JSON.parse(
      await fs.readFile('test-resources/original-image-buffer-object.txt', {
        encoding: 'utf8',
      }),
    )) as { type: 'Buffer'; data: Array<any> };
  });

  it('should resize image', async () => {
    const transformations = {
      resize: { width: 50, height: 50 },
      format: 'png',
    };

    const manipulatedImageBuffer = await getStoredBuffer(
      'manipulated-image-buffer-resize.txt',
    );
    const job = createJob(transformations);

    expect(await imageProcessor(job)).toEqual(manipulatedImageBuffer);
  });

  it('should crop image', async () => {
    const transformations = {
      crop: { width: 50, height: 50, x: 150, y: 150 },
      format: 'png',
    };

    const manipulatedImageBuffer = await getStoredBuffer(
      'manipulated-image-buffer-crop.txt',
    );

    const job = createJob(transformations);

    expect(await imageProcessor(job)).toEqual(manipulatedImageBuffer);
  });

  it('should flip image horizontally', async () => {
    const transformations = { flip: { horizontal: true }, format: 'png' };

    const manipulatedImageBuffer = await getStoredBuffer(
      'manipulated-image-buffer-flip-horizontal.txt',
    );

    const job = createJob(transformations);

    expect(await imageProcessor(job)).toEqual(manipulatedImageBuffer);
  });

  it('should flip image vertically', async () => {
    const transformations = { flip: { vertical: true }, format: 'png' };

    const manipulatedImageBuffer = await getStoredBuffer(
      'manipulated-image-buffer-flip-vertical.txt',
    );

    const job = createJob(transformations);

    expect(await imageProcessor(job)).toEqual(manipulatedImageBuffer);
  });

  it('should flip image horizontally and vertically', async () => {
    const transformations = {
      flip: { horizontal: true, vertical: true },
      format: 'png',
    };

    const manipulatedImageBuffer = await getStoredBuffer(
      'manipulated-image-buffer-flip-horizontal-and-vertical.txt',
    );

    const job = createJob(transformations);

    expect(await imageProcessor(job)).toEqual(manipulatedImageBuffer);
  });

  it('should rotate image 90 degrees', async () => {
    const transformations = { rotate: 90, format: 'png' };

    const manipulatedImageBuffer = await getStoredBuffer(
      'manipulated-image-buffer-rotate.txt',
    );

    const job = createJob(transformations);

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

    const manipulatedImageBuffer = await getStoredBuffer(
      'manipulated-image-buffer-filter-invert.txt',
    );

    const job = createJob(transformations);

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

    const manipulatedImageBuffer = await getStoredBuffer(
      'manipulated-image-buffer-filter-blur.txt',
    );

    const job = createJob(transformations);

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

    const manipulatedImageBuffer = await getStoredBuffer(
      'manipulated-image-buffer-filter-dither.txt',
    );

    const job = createJob(transformations);

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

    const manipulatedImageBuffer = await getStoredBuffer(
      'manipulated-image-buffer-filter-fisheye.txt',
    );

    const job = createJob(transformations);

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

    const manipulatedImageBuffer = await getStoredBuffer(
      'manipulated-image-buffer-filter-greyscale.txt',
    );

    const job = createJob(transformations);

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

    const manipulatedImageBuffer = await getStoredBuffer(
      'manipulated-image-buffer-filter-sepia.txt',
    );

    const job = createJob(transformations);

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

    const manipulatedImageBuffer = await getStoredBuffer(
      'manipulated-image-buffer-filter-pixelate.txt',
    );

    const job = createJob(transformations);

    expect(await imageProcessor(job)).toEqual(manipulatedImageBuffer);
  });

  it('should format image to jpeg', async () => {
    const transformations = { format: 'jpeg' };

    const manipulatedImageBuffer = await getStoredBuffer(
      'manipulated-image-buffer-format-jpeg.txt',
    );

    const job = createJob(transformations);

    expect(await imageProcessor(job)).toEqual(manipulatedImageBuffer);
  });

  it('should format image to gif', async () => {
    const transformations = { format: 'gif' };

    const manipulatedImageBuffer = await getStoredBuffer(
      'manipulated-image-buffer-format-gif.txt',
    );

    const job = createJob(transformations);

    expect(await imageProcessor(job)).toEqual(manipulatedImageBuffer);
  });
});
