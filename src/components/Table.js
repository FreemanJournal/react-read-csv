import React, { useId } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { Skeleton } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';

const columns = [
  { field: "name" },
  { field: "barcode" },
  { field: "purchase_price" },
  { field: "selling_price" },
  { field: "discount_type" },
  { field: "discount_value" },
  { field: "category" },
  { field: "unit" },
  { field: "brand" },
  { field: "alert_quantity" },
  { field: "vat_percent" },
  { field: "wholesale_price" },
  { field: "minimum_sale_price" },
  { field: "minimum_wholesale_price" },
  { field: "has_variant" },
];

export default function EnhancedTable() {
  const rows = useSelector((store) => store.product.productList);
  let id = useId();
  if (rows.length < 1) {
    return <Skeleton animation="wave" />;
  }
  console.log("table_rows", rows);

  return (
    <div style={{ height: 700, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        getRowId={()=>uuidv4()}
      />
    </div>
  );
}
