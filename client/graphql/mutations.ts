import { gql } from 'graphql-request';
import { GQL_FRAGMENT_PROPERTY, GQL_FRAGMENT_WORD } from './fragments';

export const GQL_CREATE_LANGUAGE = gql`
    mutation CreateLanguage($input: CreateLanguageInput!) {
        createLanguage(input: $input) {
            id
            name
        }
    }
`;

export const GQL_UPDATE_LANGUAGE = gql`
    mutation UpdateLanguage($input: UpdateLanguageInput!) {
        updateLanguage(input: $input) {
            id
            name
        }
    }
`;

export const GQL_CREATE_PROPERTY = gql`
    mutation CreateProperty($input: CreatePropertyInput!) {
        createProperty(input: $input) {
            ...on TextProperty {
                ...TextPropertyFragment
            }
            ...on OptionProperty {
                ...OptionPropertyFragment
            } 
        }
    }

    ${GQL_FRAGMENT_PROPERTY}
`;

export const GQL_UPDATE_PROPERTY = gql`
    mutation UpdateProperty($input: UpdatePropertyInput!) {
        updateProperty(input: $input) {
            ...on TextProperty {
                ...TextPropertyFragment
            }
            ...on OptionProperty {
                ...OptionPropertyFragment
            } 
        }
    }

    ${GQL_FRAGMENT_PROPERTY}
`;

export const GQL_CREATE_WORD = gql`
    mutation CreateWord($input: CreateWordInput!) {
        createWord(input: $input) {
            ...WordFragment
        }
    }

    ${GQL_FRAGMENT_WORD}
`;

export const GQL_UPDATE_WORD = gql`
    mutation UpdateWord($input: UpdateWordInput!) {
        updateWord(input: $input) {
            ...WordFragment
        }
    }

    ${GQL_FRAGMENT_WORD}
`;

export const GQL_DELETE_WORD = gql`
    mutation DeleteWord($id: ID!) {
        deleteWord(id: $id) {
            id
        }
    }
`;