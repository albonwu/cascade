from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, Trainer, TrainingArguments
from datasets import load_dataset

# 1. Load the tokenizer and model (T5 model for sequence-to-sequence tasks)
# Replace "t5-small" with other T5 variants like "t5-base" or "Salesforce/codet5-base" if needed
tokenizer = AutoTokenizer.from_pretrained("t5-small")
model = AutoModelForSeq2SeqLM.from_pretrained("t5-small")

# 2. Load and prepare the dataset
# Replace this with your actual dataset; ensure it has "input_column" and "output_column"
# Placeholder for your CSS generation dataset (replace "your_dataset" with the actual dataset)
# Example: raw input could be a design description, and the output is the CSS code

dataset = load_dataset("KingstarOMEGA/HTML-CSS-UI")

# 3. Tokenize the dataset
def preprocess_function(examples):
    # Replace 'input_column' and 'output_column' with actual column names of your dataset
    inputs = examples['description']  # <--- Replace with your input data column
    targets = examples['code']  # <--- Replace with your output data column
    
    # Tokenize inputs and outputs
    model_inputs = tokenizer(inputs, padding="max_length", truncation=True, max_length=512)
    
    # Tokenize the target/output (CSS code)
    labels = tokenizer(targets, padding="max_length", truncation=True, max_length=512)
    
    model_inputs["labels"] = labels["input_ids"]
    return model_inputs

# Apply tokenization to the dataset
tokenized_dataset = dataset.map(preprocess_function, batched=True)

# 4. Set up training arguments
training_args = TrainingArguments(
    output_dir="./results",            # Where to save model outputs
    evaluation_strategy="epoch",       # Evaluate after every epoch
    per_device_train_batch_size=16,     # Adjust batch size as needed
    num_train_epochs=3,                # Set the number of epochs
    save_strategy="epoch",             # Save model after every epoch
    logging_dir="./logs",              # Log directory
    logging_steps=100,                 # Log after every 100 steps
    load_best_model_at_end=True,       # Load the best model after training
)

# 5. Initialize the Trainer
trainer = Trainer(
    model=model,                              # The pre-trained model (T5)
    args=training_args,                       # Training arguments defined above
    train_dataset=tokenized_dataset["train"], # Tokenized training data
    # eval_dataset=tokenized_dataset["validation"], # Tokenized validation data
)

# 6. Train the model
trainer.train()

# 7. Evaluate the model on validation data
eval_results = trainer.evaluate()
print(f"Evaluation results: {eval_results}")

# 8. Save the fine-tuned model and tokenizer
# Specify the output directory for your fine-tuned model
model.save_pretrained("./fine_tuned_model")  # <--- Replace with your desired output directory
tokenizer.save_pretrained("./fine_tuned_model")

# 9. (Optional) Make predictions with the fine-tuned model
# Replace 'test_dataset' with your actual test data (if applicable)
# Example: testing on new CSS design descriptions
test_examples = [
    "Create a layout with a centered div and responsive padding."
    # Add more test inputs here
]

# Tokenize the input for prediction
inputs = tokenizer(test_examples, return_tensors="pt", padding=True, truncation=True)
outputs = model.generate(inputs["input_ids"])

# Decode the generated CSS code
decoded_css = [tokenizer.decode(output, skip_special_tokens=True) for output in outputs]
print("Generated CSS:", decoded_css)
