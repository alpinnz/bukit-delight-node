import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Actions from "../../../actions";
import CustomerDesktopMenuContent from "./desktop-menu-panel";

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));
vi.mock("react-router-dom", () => ({
  useLocation: vi.fn(),
  useParams: vi.fn(),
}));
vi.mock("../../../components/common/loading.custom", () => ({
  default: () => <div>loading menus</div>,
}));
vi.mock("../../../assets/icons", () => ({
  default: { star: "star.png" },
}));

type TestMenu = {
  _id: string;
  name: string;
  image: string;
  price: number;
  promo: number;
  favorite?: boolean;
  id_category: { _id: string };
};

const makeMenu = (id: string, changes: Partial<TestMenu> = {}): TestMenu => ({
  _id: id,
  name: `Menu ${id}`,
  image: `${id}.jpg`,
  price: 10000,
  promo: 0,
  id_category: { _id: "category-1" },
  ...changes,
});

describe("CustomerDesktopMenuContent", () => {
  const dispatch = vi.fn();
  let menus: TestMenu[] = [];
  let isLoading = false;
  let pathname = "/customer/book/category-1";
  let categoryId = "category-1";

  beforeEach(() => {
    vi.clearAllMocks();
    menus = [
      makeMenu("tea"),
      makeMenu("coffee", { promo: 2000, favorite: true }),
      makeMenu("lunch", { id_category: { _id: "category-2" } }),
    ];
    isLoading = false;
    pathname = "/customer/book/category-1";
    categoryId = "category-1";
    vi.mocked(useDispatch).mockReturnValue(dispatch);
    vi.mocked(useLocation).mockImplementation(
      () => ({ pathname }) as ReturnType<typeof useLocation>,
    );
    vi.mocked(useParams).mockImplementation(
      () => ({ categoryId }) as ReturnType<typeof useParams>,
    );
    vi.mocked(useSelector).mockImplementation((selector) =>
      selector({
        Menus: { loading: isLoading, data: menus },
        Cart: { selected: { menu: {} } },
      } as never),
    );
  });
  afterEach(cleanup);

  it("filters menus by category and opens the selected menu in the desktop panel", () => {
    render(<CustomerDesktopMenuContent />);

    expect(
      screen.getByRole("button", { name: "Pilih Menu tea" }),
    ).toBeDefined();
    expect(
      screen.queryByRole("button", { name: "Pilih Menu lunch" }),
    ).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Pilih Menu tea" }));

    expect(dispatch).toHaveBeenCalledWith(Actions.Cart.selectedAdd(menus[0]));
  });

  it("shows promo and favorite menus on the customer home path", () => {
    pathname = "/customer/home";

    render(<CustomerDesktopMenuContent />);

    expect(
      screen.getByRole("button", { name: "Pilih Menu coffee" }),
    ).toBeDefined();
    expect(screen.queryByRole("button", { name: "Pilih Menu tea" })).toBeNull();
    expect(
      screen.queryByRole("button", { name: "Pilih Menu lunch" }),
    ).toBeNull();
  });

  it("paginates six menu cards per page", () => {
    menus = Array.from({ length: 7 }, (_, index) => makeMenu(`menu-${index}`));

    render(<CustomerDesktopMenuContent />);

    expect(
      screen.getByRole("button", { name: "Pilih Menu menu-0" }),
    ).toBeDefined();
    expect(
      screen.queryByRole("button", { name: "Pilih Menu menu-6" }),
    ).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Page 2" }));
    expect(
      screen.getByRole("button", { name: "Pilih Menu menu-6" }),
    ).toBeDefined();
  });

  it("shows loading while menu data is loading", () => {
    isLoading = true;

    render(<CustomerDesktopMenuContent />);

    expect(screen.getByText("loading menus")).toBeDefined();
  });
});
