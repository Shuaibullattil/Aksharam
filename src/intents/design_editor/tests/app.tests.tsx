/* eslint-disable formatjs/no-literal-string-in-jsx */
import { useFeatureSupport } from "@canva/app-hooks";
import { TestAppI18nProvider } from "@canva/app-i18n-kit";
import { TestAppUiProvider } from "@canva/app-ui-kit";
import { addElementAtCursor, addElementAtPoint } from "@canva/design";
import type { Feature } from "@canva/platform";
import { requestOpenExternalUrl } from "@canva/platform";
import { fireEvent, render, waitFor } from "@testing-library/react";
import type { RenderResult } from "@testing-library/react";
import type { ReactNode } from "react";
import { App, DOCS_URL } from "../app";

// mock html-to-image
jest.mock("html-to-image", () => ({
  toPng: jest.fn().mockResolvedValue("data:image/png;base64,dummypng"),
}));

function renderInTestProvider(node: ReactNode): RenderResult {
  return render(
    // In a test environment, you should wrap your apps in `TestAppI18nProvider` and `TestAppUiProvider`, rather than `AppI18nProvider` and `AppUiProvider`
    <TestAppI18nProvider>
      <TestAppUiProvider>{node}</TestAppUiProvider>,
    </TestAppI18nProvider>,
  );
}

jest.mock("@canva/app-hooks");

// This test demonstrates how to test code that uses functions from the Canva Apps SDK
// For more information on testing with the Canva Apps SDK, see https://www.canva.dev/docs/apps/testing/
describe("Akshara Studio MVP", () => {
  const mockIsSupported = jest.fn();
  const mockUseFeatureSupport = jest.mocked(useFeatureSupport);
  const mockRequestOpenExternalUrl = jest.mocked(requestOpenExternalUrl);

  beforeEach(() => {
    jest.resetAllMocks();
    mockIsSupported.mockImplementation(
      (fn: Feature) => fn === addElementAtPoint,
    );
    mockUseFeatureSupport.mockReturnValue(mockIsSupported);
    mockRequestOpenExternalUrl.mockResolvedValue({ status: "completed" });
  });

  it("disables add button when text is empty and adds image when clicked", async () => {
    const result = renderInTestProvider(<App />);
    const addBtn = result.getByRole("button", { name: "Add to Design" });
    expect(addBtn).toBeDisabled();

    const textarea = result.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "മലയാളം" } });
    expect(addBtn).not.toBeDisabled();

    fireEvent.click(addBtn);

    await waitFor(() => expect(addElementAtPoint).toHaveBeenCalled());
  });

  it("opens docs link when docs button clicked", () => {
    const result = renderInTestProvider(<App />);
    const sdkButton = result.getByRole("button", {
      name: "Open Canva Apps SDK docs",
    });
    fireEvent.click(sdkButton);
    expect(mockRequestOpenExternalUrl).toHaveBeenCalledWith({ url: DOCS_URL });
  });

  it("snapshot remains consistent", () => {
    const result = renderInTestProvider(<App />);
    expect(result.container).toMatchSnapshot();
  });
});
