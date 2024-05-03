import torch
import torch.nn as nn
from transformers import BertPreTrainedModel, BertConfig, BertModel

# Define the custom BERT model
class CustomBertModel(BertPreTrainedModel):
    def __init__(self, config):
        super().__init__(config)
        self.bert = BertModel(config)  # Use BertModel instead of nn.Module
        self.classifier = nn.Linear(config.hidden_size, config.num_labels)

    def forward(self, input_ids, attention_mask=None, token_type_ids=None, labels=None):
        outputs = self.bert(input_ids, attention_mask=attention_mask, token_type_ids=token_type_ids)
        sequence_output = outputs[0][:, 0, :]  # Take the [CLS] token representation
        logits = self.classifier(sequence_output)

        if labels is not None:
            loss_fct = nn.CrossEntropyLoss()
            loss = loss_fct(logits.view(-1, self.config.num_labels), labels.view(-1))
            return loss, logits
        else:
            return logits