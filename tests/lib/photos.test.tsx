// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Tests car photos — uploading them, putting them in
// order, taking them away, and showing them.
//
// WHAT EACH TEST GUARDS AGAINST, in plain terms:
//   - a photo uploaded somewhere other than the address the backend signed
//     for, or without the signed fields;
//   - a minute spent uploading a photo that was always going to be refused;
//   - the photo store's own technical refusal shown to a business;
//   - photos for a new car lost, sent before the car exists, or sent in an
//     order the business did not choose;
//   - photos "added" while uploads are switched off, with nothing said;
//   - a dropped connection leaving one photo on a listing twice;
//   - a photo removed on a single slip of the finger;
//   - an address that is not https shown on the page.

import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '../render';
import { apiClient } from '@/lib/api-client';
import { ApiError } from '@/lib/api/errors';
import { photoAt } from '@/lib/photos';
import type { FleetVehicle, PhotoUploadTicket, VehiclePhoto } from '@/types';
import { fakeBackend, refusal } from '../fakeBackend';
import { VehicleForm } from '@/components/business/VehicleForm';
import { PhotoPicker, type ChosenPhoto } from '@/components/business/VehiclePhotos';
import { VehicleGallery } from '@/components/vehicle/VehicleGallery';
import { PhotoPlaceholder } from '@/components/ui';

// The test browser cannot open or redraw a picture, so getting one ready is
// stood in for: the file is passed through as it is. A file ending .heic is
// refused, the way a browser that cannot read one refuses it.
vi.mock('@/lib/photos', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/photos')>();
  return {
    ...actual,
    preparePhoto: vi.fn(async (file: File) => {
      if (file.name.endsWith('.heic')) {
        throw new ApiError({ code: 'photo_unreadable', message: 'Could not open it.', status: 0 });
      }
      return { photo: file, preview: 'data:image/jpeg;base64,AAAA' };
    }),
  };
});

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn(), prefetch: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/provider/fleet',
}));

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const STORE = 'https://api.cloudinary.test/upload';
const TICKET: PhotoUploadTicket = {
  uploadUrl: STORE,
  fields: { folder: 'sxm-rentals/vehicles/p9/v7', timestamp: '1700000000', api_key: 'test-key', signature: 'test-signature' },
  maxBytes: 8 * 1024 * 1024,
  expiresAt: '2030-01-01T00:00:00.000Z',
  photosAllowed: 12,
};

const FLEET_CAR = {
  id: 'v7',
  reference: 'SXM-V-4410',
  listingStatus: 'pending_review',
  providerId: 'p9',
  make: 'Kia',
  model: 'Picanto',
  year: 2023,
  trim: '',
  vehicleClass: 'economy',
  transmission: 'automatic',
  fuel: 'petrol',
  seats: 4,
  doors: 5,
  airConditioning: true,
  dailyRate: 38,
  minimumDays: 1,
  maximumDays: 30,
  depositAmount: 250,
  pickupTown: 'Simpson Bay',
  side: 'dutch',
  deliveryAvailable: false,
  description: '',
  accidentHistory: [],
  photos: [],
  rating: 0,
  reviewCount: 0,
  unavailableDates: [],
} as unknown as FleetVehicle;

const photo = (id: string, n: number): VehiclePhoto => ({
  id,
  url: `https://res.cloudinary.com/demo/image/upload/v1/sxm-rentals/vehicles/p9/v7/${id}.jpg`,
  position: n,
  isCover: n === 0,
});

// A stand-in photo store and backend for one car: every upload gets its own
// address, and every address sent is added to the car's list.
function photoRoutes() {
  const listed: VehiclePhoto[] = [];
  let stored = 0;
  return {
    listed,
    routes: {
      'POST /providers/me/vehicles/v7/photos/upload-ticket': { status: 200, body: TICKET },
      [`POST ${STORE}`]: () => {
        stored += 1;
        return {
          status: 200,
          body: { secure_url: `https://res.cloudinary.com/demo/image/upload/v1/sxm-rentals/vehicles/p9/v7/up${stored}.jpg` },
        };
      },
      'POST /providers/me/vehicles/v7/photos': (sent: unknown) => {
        const { url } = sent as { url: string };
        if (!listed.some((entry) => entry.url === url)) {
          listed.push({ id: `ph${listed.length + 1}`, url, position: listed.length, isCover: listed.length === 0 });
        }
        return { status: 201, body: [...listed] };
      },
    },
  };
}

const aFile = (name: string, bytes: number) => new File(['x'.repeat(bytes)], name, { type: 'image/jpeg' });
const choose = (files: File[]) => fireEvent.change(screen.getByLabelText('Add Photos'), { target: { files } });
const type = (label: RegExp, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe('showing a photo', () => {
  it('asks the photo store for the size the page shows', () => {
    const stored = 'https://res.cloudinary.com/demo/image/upload/v17/sxm-rentals/vehicles/p9/v7/a.jpg';
    expect(photoAt(stored, { width: 800 })).toBe(
      'https://res.cloudinary.com/demo/image/upload/c_limit,w_800,f_auto,q_auto/v17/sxm-rentals/vehicles/p9/v7/a.jpg',
    );
    expect(photoAt(stored, { width: 1200, height: 630 })).toBe(
      'https://res.cloudinary.com/demo/image/upload/c_fill,g_center,w_1200,h_630,f_auto,q_auto/v17/sxm-rentals/vehicles/p9/v7/a.jpg',
    );
  });

  it('shows nothing that is not https, and leaves any other https address alone', () => {
    expect(photoAt('http://res.cloudinary.com/demo/image/upload/a.jpg', { width: 800 })).toBeUndefined();
    expect(photoAt('javascript:alert(1)', { width: 800 })).toBeUndefined();
    expect(photoAt(undefined, { width: 800 })).toBeUndefined();
    expect(photoAt('https://example.com/a.jpg', { width: 800 })).toBe('https://example.com/a.jpg');
  });

  it('lays the photo over the grey block, and keeps the block for a car without one', () => {
    const { container, rerender } = render(
      <PhotoPlaceholder photo="https://res.cloudinary.com/demo/image/upload/v1/a.jpg" size="thumb" />,
    );
    expect(container.querySelector('img')?.getAttribute('src')).toContain('/upload/c_limit,w_400,f_auto,q_auto/v1/a.jpg');

    rerender(<PhotoPlaceholder photo={undefined} />);
    expect(container.querySelector('img')).toBeNull();
  });

  it('lets a visitor pick which of a car’s photos to see', () => {
    const photos = ['a', 'b', 'c'].map((name) => `https://res.cloudinary.com/demo/image/upload/v1/${name}.jpg`);
    render(<VehicleGallery photos={photos} name="Kia Picanto" />);

    expect(screen.getByRole('img', { name: 'Kia Picanto, photo 1 of 3' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Show photo 2' }));
    expect(screen.getByRole('img', { name: 'Kia Picanto, photo 2 of 3' })).toHaveAttribute(
      'src',
      expect.stringContaining('/b.jpg'),
    );
  });
});

describe('uploading one photo', () => {
  it('gets a ticket, then sends the file straight to the photo store with the signed fields', async () => {
    const { routes } = photoRoutes();
    const calls = fakeBackend(routes);

    const address = await apiClient.uploadVehiclePhoto('v7', aFile('a.jpg', 5));

    expect(address).toBe('https://res.cloudinary.com/demo/image/upload/v1/sxm-rentals/vehicles/p9/v7/up1.jpg');
    expect([...calls]).toEqual(['POST /providers/me/vehicles/v7/photos/upload-ticket', `POST ${STORE}`]);
    expect(calls.sent[1].body).toEqual({ ...TICKET.fields, file: '(file, 5 bytes)' });
  });

  it('says a photo is too large before spending any time uploading it', async () => {
    const calls = fakeBackend({
      'POST /providers/me/vehicles/v7/photos/upload-ticket': { status: 200, body: { ...TICKET, maxBytes: 10 } },
    });

    await expect(apiClient.uploadVehiclePhoto('v7', aFile('a.jpg', 20))).rejects.toMatchObject({
      code: 'photo_too_large',
    });
    expect(calls).not.toContain(`POST ${STORE}`);
  });

  it('keeps the photo store’s own refusal away from the business', async () => {
    fakeBackend({
      'POST /providers/me/vehicles/v7/photos/upload-ticket': { status: 200, body: TICKET },
      [`POST ${STORE}`]: {
        status: 401,
        body: { error: { message: "Invalid Signature 3f2a. String to sign - 'folder=x&timestamp=1'." } },
      },
    });

    const failure = await apiClient.uploadVehiclePhoto('v7', aFile('a.jpg', 5)).catch((caught) => caught);
    expect(failure).toMatchObject({ code: 'upload_failed' });
    expect(failure.message).not.toMatch(/Signature/);
  });
});

describe('photos for a car being added', () => {
  async function fillAndChoose(files: File[]) {
    type(/^Make/, 'Kia');
    type(/^Model/, 'Picanto');
    type(/^Year/, '2023');
    type(/^Daily rate/i, '38');
    type(/^Deposit amount/i, '250');
    type(/^Collected from/, 'Simpson Bay');
    choose(files);
    await screen.findByRole('img', { name: `Photo ${files.length}` });
  }

  it('holds them until the car exists, then uploads them to it in the order chosen', async () => {
    const { routes, listed } = photoRoutes();
    const calls = fakeBackend({
      'POST /providers/me/vehicles': { status: 201, body: FLEET_CAR },
      'GET /providers/me/vehicles/v7/photos': { status: 200, body: [] },
      ...routes,
    });
    render(<VehicleForm />);

    await fillAndChoose([aFile('front.jpg', 4), aFile('back.jpg', 8)]);
    // Nothing leaves before the car exists.
    expect(calls).toHaveLength(0);

    // The second one chosen is made the cover.
    fireEvent.click(screen.getByRole('button', { name: 'Make photo 2 the cover' }));
    fireEvent.click(screen.getByRole('button', { name: /Add This Vehicle/i }));

    await screen.findByText('Submitted for Approval');
    await waitFor(() => expect(listed).toHaveLength(2));

    expect(calls[0]).toBe('POST /providers/me/vehicles');
    const sizes = calls.sent
      .filter((entry) => entry.call === `POST ${STORE}`)
      .map((entry) => (entry.body as { file: string }).file);
    expect(sizes).toEqual(['(file, 8 bytes)', '(file, 4 bytes)']);
    // Held back while they went up — a disabled button — and a link again now.
    await waitFor(() => expect(screen.getByRole('link', { name: /Back to Your Fleet/i })).toBeInTheDocument());
  });

  it('keeps the car and says plainly when photo uploads are not switched on', async () => {
    const calls = fakeBackend({
      'POST /providers/me/vehicles': { status: 201, body: FLEET_CAR },
      'GET /providers/me/vehicles/v7/photos': { status: 200, body: [] },
      'POST /providers/me/vehicles/v7/photos/upload-ticket': refusal(
        503,
        'uploads_unavailable',
        'Photo uploads are not switched on yet. Please try again later.',
      ),
    });
    render(<VehicleForm />);

    await fillAndChoose([aFile('front.jpg', 4), aFile('back.jpg', 8)]);
    fireEvent.click(screen.getByRole('button', { name: /Add This Vehicle/i }));

    await screen.findByText('Submitted for Approval');
    await screen.findByText(/Photo uploads aren’t switched on yet/);
    // Once it is known that nothing gets through, nothing else is tried.
    expect(calls.filter((call) => call.endsWith('/upload-ticket'))).toHaveLength(1);
    expect(screen.getAllByText('Not uploaded')).toHaveLength(2);
    // Nothing is still going up, so nothing holds the business on the page.
    expect(screen.getByRole('link', { name: /Back to Your Fleet/i })).toBeInTheDocument();
  });

  it('holds no more than twelve, and names a file it could not open', async () => {
    let chosen: ChosenPhoto[] = [];
    function Holder() {
      const [photos, setPhotos] = React.useState<ChosenPhoto[]>([]);
      chosen = photos;
      return <PhotoPicker chosen={photos} setChosen={setPhotos} />;
    }
    render(<Holder />);

    choose([aFile('IMG_0001.heic', 3), ...Array.from({ length: 13 }, (_, index) => aFile(`${index}.jpg`, 3))]);

    await screen.findByText(/only the first 12 you chose were added/);
    expect(screen.getByText(/couldn’t be opened as photos: IMG_0001\.heic/)).toBeInTheDocument();
    // Twelve taken — the unreadable one among them — and eleven that could be read.
    expect(chosen).toHaveLength(11);
  });
});

describe('the photos of a listed car', () => {
  it('makes another photo the cover, saved at once', async () => {
    const calls = fakeBackend({
      'GET /providers/me/vehicles/v7/photos': { status: 200, body: [photo('p1', 0), photo('p2', 1)] },
      'PATCH /providers/me/vehicles/v7/photos': { status: 200, body: [photo('p2', 0), photo('p1', 1)] },
    });
    render(<VehicleForm vehicle={FLEET_CAR} />);

    fireEvent.click(await screen.findByRole('button', { name: 'Make photo 2 the cover' }));

    await waitFor(() =>
      expect(calls.sent.find((entry) => entry.call === 'PATCH /providers/me/vehicles/v7/photos')?.body).toEqual({
        order: ['p2', 'p1'],
      }),
    );
    // Looked up afresh each time: the tiles move, so the first one changes.
    await waitFor(() =>
      expect(within(screen.getAllByRole('listitem')[0]).getByRole('img')).toHaveAttribute(
        'src',
        expect.stringContaining('/p2.jpg'),
      ),
    );
  });

  it('asks before removing a photo', async () => {
    const calls = fakeBackend({
      'GET /providers/me/vehicles/v7/photos': { status: 200, body: [photo('p1', 0), photo('p2', 1)] },
      'DELETE /providers/me/vehicles/v7/photos/p1': { status: 200, body: [photo('p2', 0)] },
    });
    render(<VehicleForm vehicle={FLEET_CAR} />);

    fireEvent.click(await screen.findByRole('button', { name: 'Remove photo 1' }));
    expect(calls).not.toContain('DELETE /providers/me/vehicles/v7/photos/p1');

    fireEvent.click(await screen.findByRole('button', { name: /Remove It/i }));
    await waitFor(() => expect(calls).toContain('DELETE /providers/me/vehicles/v7/photos/p1'));
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Remove photo 2' })).not.toBeInTheDocument());
  });

  it('after a dropped connection, tries again without uploading the photo twice', async () => {
    const { routes, listed } = photoRoutes();
    let dropped = false;
    const calls = fakeBackend({
      'GET /providers/me/vehicles/v7/photos': { status: 200, body: [] },
      ...routes,
      // The first time the address is sent, the connection goes.
      'POST /providers/me/vehicles/v7/photos': (sent: unknown) => {
        if (!dropped) {
          dropped = true;
          throw new TypeError('Failed to fetch');
        }
        return routes['POST /providers/me/vehicles/v7/photos'](sent);
      },
    });
    render(<VehicleForm vehicle={FLEET_CAR} />);

    await screen.findByLabelText('Add Photos');
    choose([aFile('front.jpg', 4)]);
    await screen.findByText(/Check your connection, then try it again/);

    fireEvent.click(screen.getByRole('button', { name: 'Try photo 1 again' }));
    await waitFor(() => expect(listed).toHaveLength(1));

    expect(calls.filter((call) => call.endsWith('/upload-ticket'))).toHaveLength(1);
    expect(calls.filter((call) => call === `POST ${STORE}`)).toHaveLength(1);
    const sentAddresses = calls.sent
      .filter((entry) => entry.call === 'POST /providers/me/vehicles/v7/photos')
      .map((entry) => (entry.body as { url: string }).url);
    expect(sentAddresses).toHaveLength(2);
    expect(sentAddresses[0]).toBe(sentAddresses[1]);
  });
});
