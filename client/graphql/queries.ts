
import { gql } from 'graphql-request';
import { GQL_FRAGMENT_PROPERTY, GQL_FRAGMENT_WORD } from './fragments';

export const GQL_GET_LANGUAGES = gql`
    query Languages {
        languages {
            id
            name
        }
    }
`;

export const GQL_GET_PROPERTIES = gql`
    query Properties($languageId: ID!, $partOfSpeech: PartOfSpeech) {
        language(id: $languageId) {
            properties(partOfSpeech: $partOfSpeech) {
                ...on TextProperty {
                    ...TextPropertyFragment
                }
                ...on OptionProperty {
                    ...OptionPropertyFragment
                } 
            }
        }
    }

    ${GQL_FRAGMENT_PROPERTY}
`;

export const GQL_GET_WORDS = gql`
    query Words($languageId: ID!, $start: Int, $limit: Int, $query: String, $order: WordOrder) {
        language(id: $languageId) {
            words(start: $start, limit: $limit, query: $query, order: $order) {
                items {
                    ...WordFragment
                }
                hasMore
            }
        }
    }

    ${GQL_FRAGMENT_WORD}
`;