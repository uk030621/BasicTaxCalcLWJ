//app/api/tax-parameters/[id]/route.js
import connectDB from "@/db/connect";
import TaxParameter from "@/models/TaxParameter";

// PUT: Update a tax parameter by ID
export async function PUT(request, context) {
  try {
    await connectDB();

    const params = await context.params;
    const id = params.id; // Extract the ID from the params

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID is required for update." }),
        { status: 400 }
      );
    }

    const data = await request.json(); // Parse the request body
    const { year, ...updateFields } = data; // Extract year and other fields

    // Check if any fields (including year) are being updated
    if (!year && Object.keys(updateFields).length === 0) {
      return new Response(
        JSON.stringify({ error: "No fields provided for update." }),
        { status: 400 }
      );
    }

    // Build the update object, including year if it's provided
    const updateData = {
      ...updateFields,
      ...(year && { year }), // Conditionally include year
    };

    const updatedParameter = await TaxParameter.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true } // Return updated document, validate fields
    );

    if (!updatedParameter) {
      return new Response(JSON.stringify({ error: "Record not found." }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedParameter), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update record." }), {
      status: 500,
    });
  }
}

// DELETE: Remove a tax parameter by ID
export async function DELETE(_request, context) {
  try {
    //console.log("Incoming DELETE Request URL:", _request.url);
    //console.log("Context object:", context);

    await connectDB();

    // Await params before destructuring
    const params = await context.params;
    const id = params.id; // Now you can safely access id

    //console.log("Extracted ID:", id);

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID is required for deletion." }),
        { status: 400 }
      );
    }

    const deletedParameter = await TaxParameter.findByIdAndDelete(id);

    if (!deletedParameter) {
      return new Response(JSON.stringify({ error: "Record not found." }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "Record deleted" }), {
      status: 200,
    });
  } catch (error) {
    //console.error("Error during DELETE request:", error);
    return new Response(JSON.stringify({ error: "Failed to delete record." }), {
      status: 500,
    });
  }
}
