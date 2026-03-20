import { nanoid } from 'nanoid';

export const generateId = (size = 6): string => nanoid(size);
