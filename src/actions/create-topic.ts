'use server';
import { z } from 'zod';
import { auth } from '@/auth';

const createTopicSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/[a-z-]/, {
      message: 'Must be lowercase letters or dashes without spaces',
    }),
  description: z.string().min(10),
});

interface CreateTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
    _form?: string[];
  };
}
/*
 create a new record that is going to
// be listed out on the homepage
// do not need to revalidate topicShow
// we have not hashed a topic that has
// not yet been created
// no hashed version of that page for us
 to revalidate
 TODO: revalidate the homepage
 */
export async function createTopic(
  formState: CreateTopicFormState,
  formData: FormData
): Promise<CreateTopicFormState> {
  const result = createTopicSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });
  // const name = formData.get('name');
  // const description = formData.get('description');

  // console.log(`Name: ${name} Description: ${description}`);
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ['You must be signed in to do this'],
      },
    };
  }
  return {
    errors: {},
  };
}
