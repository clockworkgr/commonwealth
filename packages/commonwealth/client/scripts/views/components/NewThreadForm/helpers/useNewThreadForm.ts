import type { DeltaStatic } from 'quill';
import { useEffect, useMemo, useState } from 'react';

import { useDraft } from 'hooks/useDraft';
import { useSearchParams } from 'react-router-dom';
import type Topic from '../../../../models/Topic';
import { getTextFromDelta } from '../../react_quill_editor';

type NewThreadDraft = {
  topicId: number;
  title: string;
  body: DeltaStatic;
};

const useNewThreadForm = (communityId: string, topicsForSelector: Topic[]) => {
  const [searchParams] = useSearchParams();
  const topicIdFromUrl: number = parseInt(searchParams.get('topic') || '0');

  const { saveDraft, restoreDraft, clearDraft } = useDraft<NewThreadDraft>(
    `new-thread-${communityId}-info`,
  );

  // get restored draft on init
  const restoredDraft: NewThreadDraft | null = useMemo(() => {
    if (!topicsForSelector.length || topicIdFromUrl === 0) {
      return null;
    }
    return restoreDraft();
  }, [restoreDraft, topicsForSelector, topicIdFromUrl]);

  const defaultTopic = useMemo(() => {
    return (
      topicsForSelector.find(
        (t) =>
          t.id === restoredDraft?.topicId ||
          (topicIdFromUrl && t.id === topicIdFromUrl),
      ) ||
      topicsForSelector.find((t) => t.name.includes('General')) ||
      null
    );
  }, [restoredDraft, topicsForSelector, topicIdFromUrl]);

  // @ts-expect-error StrictNullChecks
  const [threadTopic, setThreadTopic] = useState<Topic>(defaultTopic);
  const [threadTitle, setThreadTitle] = useState(restoredDraft?.title || '');
  const [threadContentDelta, setThreadContentDelta] = useState<DeltaStatic>(
    restoredDraft?.body,
  );
  const editorText = getTextFromDelta(threadContentDelta);

  const hasTopics = !!topicsForSelector?.length;
  const topicMissing = hasTopics && !threadTopic;
  const titleMissing = !threadTitle;
  const contentMissing = editorText.length === 0;

  const isDisabled = titleMissing || topicMissing || contentMissing;

  // on content updated, save draft
  useEffect(() => {
    const draft = {
      topicId: threadTopic?.id || 0,
      title: threadTitle,
      body: threadContentDelta,
    };
    if (!draft.topicId && !draft.title && !draft.body) {
      return;
    }
    saveDraft(draft);

    if (!threadContentDelta && threadTopic?.defaultOffchainTemplate) {
      try {
        const template = JSON.parse(
          threadTopic.defaultOffchainTemplate,
        ) as DeltaStatic;
        setThreadContentDelta(template);
      } catch (e) {
        console.log(e);
      }
    }

    if (!threadTopic && defaultTopic) {
      setThreadTopic(defaultTopic);
    }
  }, [saveDraft, threadTopic, threadTitle, threadContentDelta, defaultTopic]);

  return {
    threadTitle,
    setThreadTitle,
    threadTopic,
    setThreadTopic,
    threadContentDelta,
    setThreadContentDelta,
    isDisabled,
    clearDraft,
  };
};

export default useNewThreadForm;
