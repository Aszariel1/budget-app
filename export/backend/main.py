"""
50/30/20 Budget Rule - FastAPI Backend
Run: pip install fastapi uvicorn && uvicorn main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from uuid import uuid4
from datetime import date
from typing import Optional

app = FastAPI(title="50/30/20 Budget API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---

CATEGORY_RATIOS = {"Needs": 0.5, "Wants": 0.3, "Savings": 0.2}

SUBCATS = {
    "Needs": ["Rent", "Utilities", "Groceries", "Transport"],
    "Wants": ["Drinks", "Entertainment", "Clothes", "Subscriptions"],
    "Savings": ["Manual Add", "Transfer from Needs", "Transfer from Wants"],
}


class Salary(BaseModel):
    amount: float
    date: str


class Expense(BaseModel):
    id: Optional[str] = None
    amount: float
    cat: str  # "Needs" | "Wants" | "Savings"
    subcat: str
    date: Optional[str] = None


class BudgetState(BaseModel):
    salaries: list[Salary] = []
    expenses: list[Expense] = []
    currency: str = "USD"


# --- In-memory store (replace with DB in production) ---
state = BudgetState()


# --- Helper functions ---

def get_current_salary() -> float:
    return sum(s.amount for s in state.salaries)


def get_totals():
    salary = get_current_salary()
    targets = {}
    spent = {}
    remaining = {}
    percent = {}

    for cat, ratio in CATEGORY_RATIOS.items():
        targets[cat] = salary * ratio
        spent[cat] = sum(e.amount for e in state.expenses if e.cat == cat)

    # Transfers from Needs/Wants to Savings also count as spent in source categories
    for e in state.expenses:
        if e.cat == "Savings" and e.subcat == "Transfer from Needs":
            spent["Needs"] += e.amount
        elif e.cat == "Savings" and e.subcat == "Transfer from Wants":
            spent["Wants"] += e.amount

    for cat in CATEGORY_RATIOS:
        remaining[cat] = max(targets[cat] - spent[cat], 0)
        percent[cat] = spent[cat] / targets[cat] if targets[cat] > 0 else 0

    return {"targets": targets, "spent": spent, "remaining": remaining, "percent": percent}


# --- API Routes ---

@app.get("/api/state")
def get_state():
    return {
        "salaries": state.salaries,
        "expenses": state.expenses,
        "currency": state.currency,
        "salary": get_current_salary(),
        "totals": get_totals(),
    }


@app.post("/api/salary")
def add_salary(salary: Salary):
    state.salaries.append(salary)
    return {"salary": get_current_salary(), "totals": get_totals()}


@app.post("/api/expense")
def add_expense(expense: Expense):
    expense.id = str(uuid4())
    expense.date = expense.date or date.today().isoformat()
    state.expenses.append(expense)
    return {"expense": expense, "totals": get_totals()}


@app.delete("/api/expense/{expense_id}")
def delete_expense(expense_id: str):
    state.expenses = [e for e in state.expenses if e.id != expense_id]
    return {"totals": get_totals()}


@app.put("/api/currency/{currency}")
def set_currency(currency: str):
    state.currency = currency
    return {"currency": state.currency}


@app.get("/api/subcategories")
def get_subcategories():
    return SUBCATS


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
