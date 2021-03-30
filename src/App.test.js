import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import App, {
  storiesReducer,
  Item,
  List,
  SearchForm,
  InputWithLabel,
} from "./App";
import axios from "axios";

//#region Mock Data
const storyOne = {
  title: "React",
  url: "https://reactjs.org/",
  author: "Jordan Walke",
  num_comments: 3,
  points: 4,
  objectID: 0,
};

const storyTwo = {
  title: "Redux",
  url: "https://redux.js.org/",
  author: "Dan Abramov, Andrew Clark",
  num_comments: 2,
  points: 5,
  objectID: 1,
};

const stories = [storyOne, storyTwo];

jest.mock("axios");

//#endregion

describe("storiesReducer", () => {
  test("remove a story from all stories", () => {
    const action = { type: "REMOVE_STORY", payload: storyOne };
    const state = { data: stories, isLoading: false, isError: false };

    const newState = storiesReducer(state, action);
    const expectedState = {
      data: [storyTwo],
      isLoading: false,
      isError: false,
    };
    expect(newState).toStrictEqual(expectedState);
  });
  test("initialize fetch of all stories", () => {
    const action = { type: "STORIES_FETCH_INIT" };
    const state = { data: stories, isLoading: false, isError: false };

    const newState = storiesReducer(state, action);
    const expectedState = {
      data: [storyOne, storyTwo],
      isLoading: true,
      isError: false,
    };
    expect(newState).toStrictEqual(expectedState);
  });
  test("fetched of all stories", () => {
    const action = { type: "STORIES_FETCH_SUCCESS", payload: stories };
    const state = { data: stories, isLoading: false, isError: false };

    const newState = storiesReducer(state, action);
    const expectedState = {
      data: stories,
      isLoading: false,
      isError: false,
    };
    expect(newState).toStrictEqual(expectedState);
  });
  test("error of storiesReducer", () => {
    const action = { type: "STORIES_FETCH_FAILURE" };
    const state = { data: stories, isLoading: false, isError: true };

    const newState = storiesReducer(state, action);
    const expectedState = {
      data: stories,
      isLoading: false,
      isError: true,
    };
    expect(newState).toStrictEqual(expectedState);
  });
});

describe("Item", () => {
  test("renders all properties", () => {
    render(<Item item={storyOne} />);

    //screen.debug();

    expect(screen.getByText("Jordan Walke")).toBeInTheDocument();
    expect(screen.getByText("React")).toHaveAttribute(
      "href",
      "https://reactjs.org/"
    );
  });
  test("renders a clickable dismiss button", () => {
    render(<Item item={storyOne} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("click dismiss button calls callback handler", () => {
    const handleRemoveItem = jest.fn();
    render(<Item item={storyOne} onRemoveItem={handleRemoveItem} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
  });
});

describe("SearchForm", () => {
  const searchFormProps = {
    searchTerm: "React",
    onSearchInput: jest.fn(),
    onSearchSubmit: jest.fn(),
  };

  test("renders the input field with its value", () => {
    render(<SearchForm {...searchFormProps} />);

    //screen.debug();

    expect(screen.getByDisplayValue("React")).toBeInTheDocument();
  });

  test("renders the correct label", () => {
    render(<SearchForm {...searchFormProps} />);
    expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
  });

  test("calls onSearchInput on input field change", () => {
    render(<SearchForm {...searchFormProps} />);
    fireEvent.change(screen.getByDisplayValue("React"), {
      target: { value: "Redux" },
    });

    expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
  });

  test("calls onSearchSubmit on button submit click", () => {
    render(<SearchForm {...searchFormProps} />);
    fireEvent.submit(screen.getByRole("button"));
    expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
  });
});

describe("App", () => {
  test("succeeds fetching data", async () => {
    const promise = Promise.resolve({
      data: {
        hits: stories,
      },
    });
    axios.get.mockImplementationOnce(() => promise);
    render(<App />);
    expect(screen.queryByText(/Loading/)).toBeInTheDocument();
    //screen.debug();
    await act(() => promise);
    //screen.debug();
    expect(screen.queryByText(/Loading/)).toBeNull();

    expect(screen.queryByText("React")).toBeInTheDocument();
    expect(screen.queryByText("Redux")).toBeInTheDocument();
    expect(screen.getAllByTestId("dismiss-button").length).toBe(2);
  });

  test("fails to fetch data", async () => {
    const promise = Promise.reject();
    axios.get.mockImplementationOnce(() => promise);

    render(<App />);

    expect(screen.getByText(/Loading/)).toBeInTheDocument();

    try {
      await act(() => promise);
    } catch (error) {
      expect(screen.queryByText(/Loading/)).toBeNull();
      expect(screen.queryByText(/went wrong/)).toBeInTheDocument();
    }
  });

  test("remove a story", async () => {
    const promise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    axios.get.mockImplementationOnce(() => promise);

    render(<App />);

    await act(() => promise);

    expect(screen.getAllByTestId("dismiss-button").length).toBe(2);
    expect(screen.getByText("Jordan Walke")).toBeInTheDocument();

    fireEvent.click(screen.getAllByTestId("dismiss-button")[0]);

    expect(screen.getAllByTestId("dismiss-button").length).toBe(1);
    expect(screen.queryByText("Jordan Walke")).toBeNull();
  });

  test("searches for specific stories", async () => {
    const reactPromise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    const anotherStory = {
      title: "JavaScript",
      url: "https://en.wikipedia.org/iki/JavaScript",
      author: "Brendan Eich",
      num_comments: 15,
      points: 10,
      objectID: 3,
    };

    const JavaScriptPromise = Promise.resolve({
      data: {
        hits: [anotherStory],
      },
    });

    axios.get.mockImplementation((url) => {
      if (url.includes("React")) {
        return reactPromise;
      }

      if (url.includes("JavaScript")) {
        return JavaScriptPromise;
      }
      throw Error();
    });

    //Initial Render
    render(<App />);

    //First Data Fetching
    await act(() => reactPromise);

    expect(screen.queryByDisplayValue("React")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("JavaScript")).toBeNull();
    expect(screen.queryByText("Jordan Walke")).toBeInTheDocument();
    expect(screen.queryByText("Dan Abramov, Andrew Clark")).toBeInTheDocument();
    expect(screen.queryByText("Brendan Eich")).toBeNull();

    //User interaction
    fireEvent.change(screen.queryByDisplayValue("React"), {
      target: {
        value: "JavaScript",
      },
    });

    expect(screen.queryByDisplayValue("React")).toBeNull();
    expect(screen.queryByDisplayValue("JavaScript")).toBeInTheDocument();

    fireEvent.submit(screen.queryByTestId("submit"));

    //Second Data Fetch
    await act(() => JavaScriptPromise);
    expect(screen.queryByText("Jordan Walke")).toBeNull();
    expect(screen.queryByText("Dan Abramov, Andrew Clark")).toBeNull();
    expect(screen.queryByText("Brendan Eich")).toBeInTheDocument();
  });
});

describe("something truthy and falsy", () => {
  test("true to be true", () => {
    expect(true).toBe(true);
  });
  it("false to be false", () => {
    expect(false).toBe(false);
  });
});

describe("App component", () => {
  test("remove an item when clicking the Dismiss button", () => {});

  test("requests some initial stories from an API", () => {});
});
