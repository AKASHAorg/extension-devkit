import PollForm from '@/components/poll-form';
import { createPoll } from '../api';

const PollFormPage = () => {
  const handleSubmit = async pollFormValues => {
    const optionsWithIDs = pollFormValues.options.map((option, index) => ({
      id: index.toString(), // TODO - generate a unique id for the option
      name: option.value,
    }));

    const res = await createPoll(pollFormValues.title, pollFormValues.description, optionsWithIDs);
    alert('Poll created successfully');
  };
  return <PollForm onSubmit={handleSubmit} />;
};

export default PollFormPage;
