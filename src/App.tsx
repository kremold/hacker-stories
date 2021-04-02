import React from "react";
import axios from "axios";
import styled from "styled-components";
import { StoriesAction, StoriesState, Story } from "./StoryTypes";
import { SearchForm } from "./SearchForm";
import { TextParagraph } from "./TextParagraph";
import { List, Item } from "./List";
import { InputWithLabel } from "./InputWithLabel";

//#region styles

const StyledContainer = styled.div`
  height: 100%;
  padding: 20px;
  background: limegreen;
  background: linear-gradient(to left, #b6fbff, limegreen);
  color: #171212;
  font-family: "Wallpoet", cursive;
`;

const StyledHeadlinePrimary = styled.h1`
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 2px;
`;

//#endregion

//#region endpoints
const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";
//#endregion

//#region reducers
const storiesReducer = (state: StoriesState, action: StoriesAction) => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};
//#endregion

//#region state helpers
const useSemiPersistentState = (
  key: string,
  initialState: string
): [string, (newValue: string) => void] => {
  // use the key so that 'value' in local storage isn't overwritten
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};
//#endregion

const App = () => {
  //#region initializers
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");

  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });
  //#endregion

  //#region handlers
  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });
    try {
      const result = await axios.get(url);

      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [url]);

  const handleRemoveStory = (item: Story) => {
    dispatchStories({ type: "REMOVE_STORY", payload: item });
  };

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };
  //#endregion

  //#region useEffect
  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);
  //#endregion

  //#region render
  return (
    <StyledContainer>
      <StyledHeadlinePrimary>My Hacker Stories.</StyledHeadlinePrimary>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <TextParagraph>
        <strong>Search Results:</strong>
      </TextParagraph>

      {stories.isError && <p> Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </StyledContainer>
  );
  //#endregion
};

export default App;

export { storiesReducer, SearchForm, InputWithLabel, List, Item };
