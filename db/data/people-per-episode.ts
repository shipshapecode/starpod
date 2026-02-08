import people from './people';

type PersonId = (typeof people)[number]['id'];

export default {} as { [key: string]: Array<{ id: PersonId; host?: boolean }> };
