import puppeteer from "puppeteer";

const browser = puppeteer.launch();

const sodimacUrl = ({
  name,
  pageNumber
}: {
  name: string;
  pageNumber: number;
}) => {};

const getPageData = async (pageNumber = 1) => {};

const searchProductSodimac = async ({ name }: { name: string }) => {};
