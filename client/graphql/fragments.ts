import { gql } from 'graphql-request';


export const GQL_FRAGMENT_PROPERTY = gql`
    fragment TextPropertyFragment on TextProperty {
        id
        name
        type
        partOfSpeech
    }

    fragment OptionPropertyFragment on OptionProperty {
        id
        name
        type
        partOfSpeech
        options {
            id
            value
        }
    }
`;

export const GQL_FRAGMENT_WORD = gql`
    fragment WordFragment on Word {
        id
        original
        translation
        partOfSpeech
        properties {
            ...on TextPropertyValue {
                property {
                    id
                    name
                    type
                }
                text
            }
            ...on OptionPropertyValue {
                property {
                    id
                    name
                    type
                }
                option {
                    id
                    value
                }
            }
        }
    }
`;