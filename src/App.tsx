import React from "react";
import axios from "axios";
import styled from "styled-components";
import { StoriesAction, StoriesState, Story } from "./StoryTypes";
import { SearchForm } from "./SearchForm";
import { TextParagraph } from "./TextParagraph";
import { List, Item } from "./List";
import { InputWithLabel } from "./InputWithLabel";
import { StyledButton } from "./StyledButton";

//#region styles

const StyledContainer = styled.div`
  height: 100%;
  padding: 20px;
  background: limegreen;
  background: linear-gradient(to left, #b6fbff, limegreen);
  color: #171212;
  font-family: "Iceberg", cursive;
`;

const StyledHeadlinePrimary = styled.h1`
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 2px;
  text-align: center;
`;

const StyledMoreButton = styled(StyledButton)`
  font-size: 24px;
  font-family: "Iceberg", cursive;
`;

//#endregion

//#region const
const API_BASE = "https://hn.algolia.com/api/v1";
const API_SEARCH = "/search";
const PARAMS_SEARCH = "query=";
const PARAMS_PAGE = "page=";
const getUrl = (searchTerm: string, page: number) =>
  `${API_BASE}${API_SEARCH}?${PARAMS_SEARCH}${searchTerm}&${PARAMS_PAGE}${page}`;
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
        data:
          action.payload.page === 0
            ? action.payload.list
            : state.data.concat(action.payload.list),
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

const extractSearchTerm = (url: string) => {
  return url
    .substring(url.lastIndexOf("?") + 1, url.lastIndexOf("&"))
    .replace(PARAMS_SEARCH, "");
};
const getLastSearches = (urls: string[]) =>
  urls
    .reduce((result: string[], url, index) => {
      const searchTerm: string = extractSearchTerm(url);
      if (index === 0) {
        return result.concat(searchTerm);
      }
      const previousSearchTerm = result[result.length - 1];
      if (searchTerm === previousSearchTerm) {
        return result;
      } else {
        return result.concat(searchTerm);
      }
    }, [])
    .slice(-6)
    .slice(0, -1)
    .map((url) => url);

//#endregion

type LastSearchProps = {
  lastSearches: string[];
  onLastSearch: (searchTerm: string) => void;
};
const LastSearch = ({ lastSearches, onLastSearch }: LastSearchProps) => (
  <>
    <TextParagraph>
      Recent Searches:
      {lastSearches.map((searchTerm, index) => (
        <StyledButton
          key={searchTerm + index}
          type="button"
          onClick={() => onLastSearch(searchTerm)}
        >
          {searchTerm}
        </StyledButton>
      ))}
    </TextParagraph>
  </>
);

const App = () => {
  //#region initializers
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");

  const [urls, setUrls] = React.useState([getUrl(searchTerm, 0)]);

  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    page: 0,
    isLoading: false,
    isError: false,
  });
  //#endregion

  //#region handlers
  const handleFetchStories = React.useCallback(async () => {
    // if (!searchTerm) return;
    dispatchStories({ type: "STORIES_FETCH_INIT" });
    try {
      const lastUrl = urls[urls.length - 1];
      const result = await axios.get(lastUrl);

      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: {
          list: result.data.hits,
          page: result.data.page,
        },
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [urls]);

  const handleRemoveStory = (item: Story) => {
    dispatchStories({ type: "REMOVE_STORY", payload: item });
  };

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    handleSearch(searchTerm, 0);
    event.preventDefault();
  };
  const handleSearch = (searchTerm: string, page: number) => {
    const url = getUrl(searchTerm, page);
    setUrls(urls.concat(url));
  };

  const handleLastSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    handleSearch(searchTerm, 0);
  };

  const handleMore = () => {
    const lastUrl = urls[urls.length - 1];
    const searchTerm = extractSearchTerm(lastUrl);
    handleSearch(searchTerm, stories.page + 1);
  };

  const lastSearches = getLastSearches(urls);
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

      <LastSearch lastSearches={lastSearches} onLastSearch={handleLastSearch} />

      <TextParagraph>
        <strong>Search Results:</strong>
      </TextParagraph>

      {stories.isError && <p> Something went wrong...</p>}

      <List list={stories.data} onRemoveItem={handleRemoveStory} />

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <StyledMoreButton type="button" onClick={handleMore}>
          More
        </StyledMoreButton>
      )}
    </StyledContainer>
  );
  //#endregion
};

export default App;

export { storiesReducer, SearchForm, InputWithLabel, List, Item };
