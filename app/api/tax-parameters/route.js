import connectDB from "@/db/connect";
import TaxParameter from "@/models/TaxParameter";

// GET: Fetch all tax parameters
export async function GET() {
  try {
    await connectDB();
    const parameters = await TaxParameter.find(); // Get all parameters
    return new Response(JSON.stringify(parameters), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// POST: Add new tax parameter
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    // Validate the top-level field "year"
    if (!data.year) {
      return new Response(JSON.stringify({ error: "Tax year is required" }), {
        status: 400,
      });
    }

    // Validate that "incomeTax" and "nationalInsurance" are objects
    if (!data.incomeTax || typeof data.incomeTax !== "object") {
      return new Response(
        JSON.stringify({
          error: "Income tax data is required and must be an object",
        }),
        { status: 400 }
      );
    }

    if (!data.nationalInsurance || typeof data.nationalInsurance !== "object") {
      return new Response(
        JSON.stringify({
          error: "National insurance data is required and must be an object",
        }),
        { status: 400 }
      );
    }

    // Validate "incomeTax" fields
    const incomeTaxFields = [
      "personalAllowance",
      "basicRate",
      "higherRate",
      "additionalRate",
      "basicThreshold",
      "higherThreshold",
      "taperThreshold",
    ];
    for (const field of incomeTaxFields) {
      if (data.incomeTax[field] == null) {
        return new Response(
          JSON.stringify({ error: `Missing incomeTax field: ${field}` }),
          { status: 400 }
        );
      }
    }

    // Validate "nationalInsurance" fields
    const nationalInsuranceFields = [
      "primaryThreshold",
      "upperEarningsLimit",
      "primaryRate",
      "upperRate",
      "selfPrimaryRate",
      "selfUpperRate",
    ];
    for (const field of nationalInsuranceFields) {
      if (data.nationalInsurance[field] == null) {
        return new Response(
          JSON.stringify({
            error: `Missing nationalInsurance field: ${field}`,
          }),
          { status: 400 }
        );
      }
    }

    // Create new tax parameter in MongoDB
    const newParameter = await TaxParameter.create(data);
    return new Response(JSON.stringify(newParameter), { status: 201 });
  } catch (error) {
    // Handle MongoDB unique constraint error for "year"
    if (error.code === 11000) {
      return new Response(
        JSON.stringify({ error: "Tax year already exists" }),
        { status: 400 }
      );
    }
    // Handle any other error
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
