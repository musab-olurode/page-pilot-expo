import { BookInfoRequest } from '@/lib/api/types';
import { GoodreadsBook } from './books';

export interface BookProviderService {
	fetchBookInfo(payload: BookInfoRequest): Promise<GoodreadsBook>;
}
