import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Quotation, QuotationCreate } from "../entities";
import { IContext } from "../interfaces";
import { assertIsDefined } from "../utils/assert";

@Resolver(() => Quotation)
export class QuotationResolver {
  constructor(
    @InjectRepository(Quotation)
    private readonly QuotationRepository: Repository<Quotation>
  ) {}

  @Authorized()
  @Query(() => [Quotation])
  async myQuotations(@Ctx() { user }: IContext) {
    assertIsDefined(user, "Auth context is not working properly");

    const quotations = await this.QuotationRepository.find({
      where: {
        user: user.email
      },
      order: {
        date: "DESC"
      },
      relations: ["products", "products.store"]
    });

    console.log({
      quotations
    });

    return quotations;
  }

  @Authorized()
  @Mutation(() => Quotation)
  async createQuotation(
    @Ctx() { user }: IContext,
    @Arg("quotation", () => QuotationCreate) quotation: QuotationCreate
  ) {
    assertIsDefined(user, "Auth context is not working properly");

    let newQuotation = this.QuotationRepository.create({
      user,
      name: quotation.name,
      products: quotation.products.map(url => ({ url })),
      date: new Date()
    });

    newQuotation = await this.QuotationRepository.save(newQuotation);

    return await this.QuotationRepository.findOneOrFail(newQuotation.id);
  }
}
