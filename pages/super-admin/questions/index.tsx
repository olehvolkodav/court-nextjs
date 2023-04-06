import { AddQuestionModal } from "@/components/question/AddQuestionModal";
import { QuestionList } from "@/components/question/QuestionList";
import { Button } from "@/components/ui/button";
import { CenterPagination } from "@/components/ui/pagination/CenterPagination";
import { PAGINATION_FIELD, PAGINATION_PARAMS, PAGINATION_VARS, parsePage } from "@/graphql/query/util";
import { withAdminLayout } from "@/hoc/layout";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { $gql } from "@/plugins/http";
import { paginationInitialState, paginationReducer } from "@/reducers/pagination.reducer";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useReducer, useState } from "react";

const QUESTIONS_QUERY = `
  query(${PAGINATION_PARAMS}) {
    questions(${PAGINATION_VARS}) {
      ${PAGINATION_FIELD}
      data {
        id
        title
        body
        place
        created_at
      }
    }
  }
`

const QuestionsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [pagination, dispatch] = useReducer(paginationReducer, paginationInitialState);

  const [questions, setQuestions] = useState<any[]>([]);

  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);

  const getQuestions = useCallback(async() => {
    const page = parsePage(router.query.page);

    try {
      const data = await $gql({
        query: QUESTIONS_QUERY,
        variables: { page }
      });

      setQuestions(data.questions.data);
      dispatch({
        type: "set",
        value: data.questions.paginatorInfo
      })
    } catch (error) {
      //
    }
  }, [router.query.page]);

  const handleQuestionAdded = () => {
    setModalOpen(false);

    getQuestions();
  }

  const handleQuestionUpdate = (question: any) => {
    setQuestions(
      prev => prev.map(prevQuestion => {
        if (prevQuestion.id == question.id) {
          return question;
        }

        return prevQuestion;
      })
    )
  }

  useEffect(() => {
    getQuestions();
  }, [getQuestions]);

  return (
    <>
      <div className="py-4">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-natural-13 text-2xl font-semibold">
              Question Library
            </h1>

            <div>
              <Button onClick={openModal}>
                Add New Question
              </Button>
            </div>
          </div>

          {!!questions.length ? (
            <>
              <div className="grid grid-cols lg:grid-cols-2 gap-4">
                {questions.map(question => (
                  <QuestionList question={question} key={question.id} onUpdate={handleQuestionUpdate} />
                ))}
              </div>

              <CenterPagination className="mt-4" data={pagination} />
            </>
          ) : (
            <div className="text-center">
              <p>
                No Questions
              </p>
            </div>
          )}
        </div>
      </div>

      <AddQuestionModal
        isOpen={modalOpen}
        onClose={setModalOpen}
        onQuestionAdded={handleQuestionAdded}
      />
    </>
  )
}

export default withAdminLayout(QuestionsPage, "Court - Questions")