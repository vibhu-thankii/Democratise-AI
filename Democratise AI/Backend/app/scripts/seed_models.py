# Example: scripts/seed_models.py
from app.db.session import SessionLocal
from app.models.model import Model
from app.utils import aware_utcnow # For timestamps if needed directly

def seed_data():
    db = SessionLocal()
    try:
        print("Seeding models...")
        models_to_add = [
            Model(name='BERT Base Uncased', description='...', source_type='huggingface', source_identifier='bert-base-uncased', task_type='Language Model', framework='pytorch'),
            Model(name='ResNet-50', description='...', source_type='torchvision', source_identifier='resnet50', task_type='Image Classification', framework='pytorch'),
            # Add more models
        ]

        existing_models = db.query(Model.source_identifier).all()
        existing_ids = {m[0] for m in existing_models}

        added_count = 0
        for model in models_to_add:
             # Simple check to avoid adding duplicates based on identifier
             if model.source_identifier not in existing_ids:
                 # Timestamps are handled by default_factory, no need to set manually
                 db.add(model)
                 added_count += 1

        if added_count > 0:
            db.commit()
            print(f"Added {added_count} new models.")
        else:
            print("No new models to add.")

    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()